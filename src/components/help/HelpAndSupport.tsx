import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Mail, Phone } from "lucide-react";

const HelpAndSupport = () => {
  return (
    <div className="w-full h-full bg-background p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Aide & Support</h1>
        <p className="text-muted-foreground">
          Trouvez des réponses à vos questions et obtenez de l'aide
        </p>
      </div>

      <Tabs defaultValue="faq" className="w-full max-w-4xl mx-auto">
        <TabsList className="mb-6">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Questions fréquemment posées</CardTitle>
              <CardDescription>
                Trouvez rapidement des réponses aux questions les plus courantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Comment ajouter un nouveau patient ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour ajouter un nouveau patient, accédez à la section
                    "Patients" dans le menu latéral, puis cliquez sur le bouton
                    "Add New" en haut à droite de la liste des patients.
                    Remplissez le formulaire avec les informations du patient
                    (nom, prénom, date de naissance, coordonnées, informations
                    d'assurance) et cliquez sur "Enregistrer". Le nouveau
                    patient apparaîtra alors dans votre répertoire de patients.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Comment planifier un rendez-vous ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour planifier un rendez-vous, vous pouvez soit :
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>
                        Accéder à la section "Calendar" dans le menu latéral et
                        cliquer sur une plage horaire disponible dans le
                        calendrier. Vous pourrez alors sélectionner un patient
                        et définir le type de rendez-vous.
                      </li>
                      <li>
                        Depuis la fiche d'un patient, cliquer sur l'onglet
                        "Appointments" puis sur "Schedule Appointment". Cela
                        ouvrira une boîte de dialogue où vous pourrez
                        sélectionner la date, l'heure et le type de rendez-vous.
                      </li>
                      <li>
                        Depuis le tableau de bord (Dashboard), utiliser l'action
                        rapide "New Appointment" dans la section Quick Actions.
                      </li>
                    </ul>
                    <p className="mt-2">
                      Une fois le rendez-vous planifié, il apparaîtra dans le
                      calendrier et dans la liste des rendez-vous du patient.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    Comment créer un plan de traitement ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour créer un plan de traitement, suivez ces étapes :
                    <ol className="list-decimal pl-6 mt-2 space-y-1">
                      <li>
                        Accédez à la section "Treatment Plans" dans le menu
                        latéral
                      </li>
                      <li>
                        Cliquez sur le bouton "New Treatment Plan" en haut de la
                        page
                      </li>
                      <li>Sélectionnez un patient dans la liste déroulante</li>
                      <li>
                        Donnez un nom au plan de traitement (par exemple,
                        "Orthodontic Treatment")
                      </li>
                      <li>
                        Ajoutez les procédures nécessaires depuis les modèles
                        disponibles en cliquant sur "Add Procedure"
                      </li>
                      <li>
                        Pour chaque procédure, spécifiez le code, le coût, et la
                        date prévue
                      </li>
                      <li>
                        Vérifiez les informations d'assurance et la couverture
                        estimée
                      </li>
                      <li>Cliquez sur "Save Treatment Plan" pour finaliser</li>
                    </ol>
                    <p className="mt-2">
                      Une fois créé, le plan de traitement sera accessible
                      depuis la fiche du patient et la section Treatment Plans.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>
                    Comment modifier mes paramètres utilisateur ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour modifier vos paramètres utilisateur :
                    <ol className="list-decimal pl-6 mt-2 space-y-1">
                      <li>Cliquez sur "Settings" dans le menu latéral</li>
                      <li>
                        Utilisez les onglets pour naviguer entre les différentes
                        sections :
                        <ul className="list-disc pl-6 mt-1 space-y-1">
                          <li>
                            <strong>Profil</strong> : Modifiez votre nom, prénom
                            et autres informations personnelles
                          </li>
                          <li>
                            <strong>Sécurité</strong> : Changez votre mot de
                            passe et configurez les options de sécurité
                          </li>
                          <li>
                            <strong>Notifications</strong> : Personnalisez vos
                            préférences de notifications par email et SMS
                          </li>
                          <li>
                            <strong>Apparence</strong> : Choisissez le thème
                            (clair/sombre/système), la couleur d'accent, la
                            taille de police et le format d'heure
                          </li>
                        </ul>
                      </li>
                      <li>
                        Après avoir effectué vos modifications, cliquez sur le
                        bouton "Enregistrer les préférences" au bas de chaque
                        section
                      </li>
                    </ol>
                    <p className="mt-2">
                      Vos préférences seront sauvegardées et appliquées
                      immédiatement à votre interface.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>
                    Comment télécharger ou importer des fichiers patient ?
                  </AccordionTrigger>
                  <AccordionContent>
                    Pour gérer les fichiers et radiographies d'un patient :
                    <ol className="list-decimal pl-6 mt-2 space-y-1">
                      <li>
                        Accédez à la section "Patients" dans le menu latéral
                      </li>
                      <li>Sélectionnez un patient dans le répertoire</li>
                      <li>
                        Dans la fiche détaillée du patient, cliquez sur l'onglet
                        "Files & X-Rays"
                      </li>
                      <li>
                        Pour télécharger un nouveau fichier :
                        <ul className="list-disc pl-6 mt-1 mb-2">
                          <li>Cliquez sur le bouton "Upload File"</li>
                          <li>
                            Sélectionnez le type de fichier (radiographie,
                            photo, document, etc.)
                          </li>
                          <li>Choisissez le fichier sur votre ordinateur</li>
                          <li>Ajoutez une description si nécessaire</li>
                          <li>Cliquez sur "Upload"</li>
                        </ul>
                      </li>
                      <li>
                        Pour visualiser un fichier existant, cliquez simplement
                        sur sa vignette
                      </li>
                      <li>
                        Pour télécharger un fichier, cliquez sur l'icône de
                        téléchargement à côté du fichier
                      </li>
                    </ol>
                    <p className="mt-2">
                      Tous les fichiers sont stockés de manière sécurisée et
                      sont accessibles uniquement aux utilisateurs autorisés.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Guides d'utilisation</CardTitle>
              <CardDescription>
                Apprenez à utiliser efficacement toutes les fonctionnalités de
                Dentix
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Gestion des patients
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apprenez à gérer efficacement les dossiers patients, les
                      antécédents médicaux et les informations d'assurance.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(
                          "Le guide complet de gestion des patients sera disponible prochainement.",
                        )
                      }
                    >
                      Voir le guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Calendrier et rendez-vous
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Découvrez comment gérer votre calendrier, planifier des
                      rendez-vous et configurer des rappels automatiques.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(
                          "Le guide complet de gestion du calendrier sera disponible prochainement.",
                        )
                      }
                    >
                      Voir le guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Plans de traitement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Apprenez à créer, modifier et partager des plans de
                      traitement détaillés avec vos patients.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(
                          "Le guide complet de gestion des plans de traitement sera disponible prochainement.",
                        )
                      }
                    >
                      Voir le guide
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border border-muted">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">
                      Analytiques et rapports
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      Découvrez comment utiliser les outils d'analyse pour
                      suivre la performance de votre cabinet.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(
                          "Le guide complet d'analytiques et rapports sera disponible prochainement.",
                        )
                      }
                    >
                      Voir le guide
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contactez-nous</CardTitle>
              <CardDescription>
                Besoin d'aide supplémentaire ? Notre équipe de support est là
                pour vous aider
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Heures de support</AlertTitle>
                  <AlertDescription>
                    Notre équipe est disponible du lundi au vendredi, de 9h à
                    18h (CET).
                  </AlertDescription>
                </Alert>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-sm text-muted-foreground">
                        Pour les questions générales et l'assistance technique
                      </p>
                      <a
                        href="mailto:support@dentix.com"
                        className="text-primary hover:underline block mt-1"
                      >
                        support@dentix.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <h3 className="font-medium">Téléphone</h3>
                      <p className="text-sm text-muted-foreground">
                        Pour une assistance immédiate pendant les heures
                        d'ouverture
                      </p>
                      <a
                        href="tel:+33123456789"
                        className="text-primary hover:underline block mt-1"
                      >
                        +33 1 23 45 67 89
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HelpAndSupport;
