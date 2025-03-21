import { supabase } from "./supabase";

// Generic data service for CRUD operations
export const dataService = {
  // Generic fetch function
  async fetch<T>(
    table: string,
    options: { columns?: string; filters?: Record<string, any> } = {},
  ) {
    try {
      let query = supabase.from(table).select(options.columns || "*");

      // Apply filters if provided
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      // Add realtime subscription for this table if not already subscribed
      const channel = supabase.channel(`public:${table}`);
      channel
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log("Change received!", payload);
            // You would typically update your local state here or trigger a refetch
            // Dispatch a custom event that components can listen for
            const event = new CustomEvent(`${table}:updated`, {
              detail: payload,
            });
            window.dispatchEvent(event);
          },
        )
        .subscribe();

      const { data, error } = await query;

      if (error) throw error;
      return data as T[];
    } catch (error) {
      console.error(`Error fetching from ${table}:`, error);
      return [];
    }
  },

  // Generic get by ID function
  async getById<T>(table: string, id: string, columns?: string) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(columns || "*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as T;
    } catch (error) {
      console.error(`Error fetching ${table} by ID:`, error);
      return null;
    }
  },

  // Generic create function
  async create<T>(table: string, item: Partial<T>) {
    try {
      const { data, error } = await supabase.from(table).insert(item).select();

      if (error) throw error;
      return data[0] as T;
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      return null;
    }
  },

  // Generic update function
  async update<T>(table: string, id: string, updates: Partial<T>) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update({ ...updates, updated_at: new Date() })
        .eq("id", id)
        .select();

      if (error) throw error;
      return data[0] as T;
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return null;
    }
  },

  // Generic delete function
  async delete(table: string, id: string) {
    try {
      const { error } = await supabase.from(table).delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return false;
    }
  },

  // Treatment plan specific functions
  treatmentPlans: {
    async saveProcedures(treatmentPlanId: string, procedures: any[]) {
      try {
        // First delete existing procedures for this plan
        await supabase
          .from("treatment_procedures")
          .delete()
          .eq("treatment_plan_id", treatmentPlanId);

        // Then insert the new procedures
        if (procedures.length > 0) {
          const proceduresToInsert = procedures.map((proc) => ({
            treatment_plan_id: treatmentPlanId,
            name: proc.name,
            code: proc.code,
            cost: proc.cost,
            description: proc.description,
            duration: proc.duration,
            category: proc.category,
          }));

          const { error } = await supabase
            .from("treatment_procedures")
            .insert(proceduresToInsert);

          if (error) throw error;
        }

        return true;
      } catch (error) {
        console.error("Error saving treatment procedures:", error);
        return false;
      }
    },

    async getProcedures(treatmentPlanId: string) {
      try {
        const { data, error } = await supabase
          .from("treatment_procedures")
          .select("*")
          .eq("treatment_plan_id", treatmentPlanId);

        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching treatment procedures:", error);
        return [];
      }
    },

    async updateProcedureTemplates(templates: any[]) {
      try {
        // Update procedure templates in batch
        for (const template of templates) {
          const { error } = await supabase.from("procedure_templates").upsert({
            id: template.id,
            name: template.name,
            code: template.code,
            cost: template.cost,
            description: template.description,
            duration: template.duration,
            category: template.category,
            updated_at: new Date(),
          });

          if (error) throw error;
        }

        return true;
      } catch (error) {
        console.error("Error updating procedure templates:", error);
        return false;
      }
    },
  },

  // User settings functions
  userSettings: {
    async get(userId: string) {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "No rows returned" error
          throw error;
        }

        return data || { user_id: userId, time_format: "24h", theme: "light" };
      } catch (error) {
        console.error("Error fetching user settings:", error);
        return { user_id: userId, time_format: "24h", theme: "light" };
      }
    },

    async update(userId: string, settings: any) {
      try {
        const { data, error } = await supabase
          .from("user_settings")
          .upsert({
            user_id: userId,
            ...settings,
            updated_at: new Date(),
          })
          .select();

        if (error) throw error;
        return data[0];
      } catch (error) {
        console.error("Error updating user settings:", error);
        return null;
      }
    },
  },
};
