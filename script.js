document.addEventListener('DOMContentLoaded', () => {
    let currentSection = 0;
    const sections = document.querySelectorAll('.form-section');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    const steps = document.querySelectorAll('.step'); // Sélectionne les étapes de la barre de progression
    let currentDay = ''; // Stocke le jour sélectionné
    let currentWeek = 1; // Pour suivre les semaines
    const modal = document.getElementById("timeSlotModal");
    const saveBtn = document.getElementById("save-time-slot");
    const cancelBtn = document.getElementById("cancel-time-slot");
    const dayNameSpan = document.getElementById("day-name");
    const startTimeInput = document.getElementById("start-time");
    const endTimeInput = document.getElementById("end-time");
    const planningContainer = document.querySelector('.planning-container');

    // Fonction pour afficher la section actuelle
    function showSection(index) {
        sections.forEach((section, idx) => {
            section.classList.toggle('active', idx === index);
            steps[idx].classList.toggle('active', idx === index); // Met à jour l'étape active
        });

        // Met à jour la barre de progression
        steps.forEach((step, idx) => {
            step.classList.remove('completed'); // Réinitialise toutes les étapes
            if (idx < index) {
                step.classList.add('completed'); // Marque les étapes précédentes comme complètes
            }
        });
    };

    // Gestion du clic sur "Suivant"
    nextButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentSection < sections.length - 1) {
                currentSection++;
                showSection(currentSection);
            }
        });
    });

    // Gestion du clic sur "Précédent"
    prevButtons.forEach((button) => {
        button.addEventListener('click', () => {
            if (currentSection > 0) {
                currentSection--;
                showSection(currentSection);
            }
        });
    });

    // Fonction pour créer un planning
    function createPlanningTable(weekNumber) {
        const table = document.createElement('table');
        table.classList.add('planning-table');

        table.innerHTML = `
            <thead>
                <tr>
                    <th></th>
                    <th>07:00</th>
                    <th>08:00</th>
                    <th>09:00</th>
                    <th>10:00</th>
                    <th>11:00</th>
                    <th>12:00</th>
                    <th>13:00</th>
                    <th>14:00</th>
                    <th>15:00</th>
                    <th>16:00</th>
                    <th>17:00</th>
                    <th>18:00</th>
                    <th>19:00</th>
                </tr>
            </thead>
            <tbody>
                <tr data-day="lundi" data-week="${weekNumber}">
                    <td>Lundi</td>
                    <td colspan="13" class="time-slot"></td>
                    <td><button class="add-slot">+</button></td>
                </tr>
                <tr data-day="mardi" data-week="${weekNumber}">
                    <td>Mardi</td>
                    <td colspan="13" class="time-slot"></td>
                    <td><button class="add-slot">+</button></td>
                </tr>
                <tr data-day="mercredi" data-week="${weekNumber}">
                    <td>Mercredi</td>
                    <td colspan="13" class="time-slot"></td>
                    <td><button class="add-slot">+</button></td>
                </tr>
                <tr data-day="jeudi" data-week="${weekNumber}">
                    <td>Jeudi</td>
                    <td colspan="13" class="time-slot"></td>
                    <td><button class="add-slot">+</button></td>
                </tr>
                <tr data-day="vendredi" data-week="${weekNumber}">
                    <td>Vendredi</td>
                    <td colspan="13" class="time-slot"></td>
                    <td><button class="add-slot">+</button></td>
                </tr>
            </tbody>
        `;

        planningContainer.appendChild(table);

        // Activer les boutons de chaque planning ajouté
        activateAddSlotButtons();
    }

    // Activer les boutons "Ajouter un créneau" pour tous les plannings
    function activateAddSlotButtons() {
        document.querySelectorAll('.add-slot').forEach(button => {
            button.addEventListener('click', function (event) {
                event.preventDefault(); // Empêche tout comportement par défaut
                event.stopPropagation(); // Empêche la propagation de l'événement vers les boutons de navigation

                currentDay = this.closest('tr').getAttribute('data-day'); // Récupère le jour
                currentWeek = this.closest('tr').getAttribute('data-week'); // Récupère la semaine
                dayNameSpan.textContent = `${currentDay.charAt(0).toUpperCase() + currentDay.slice(1)} - Semaine ${currentWeek}`; // Affiche le jour et la semaine dans la modale
                modal.style.display = "block"; // Ouvre la modale
            });
        });
    }

    // Sauvegarde le créneau horaire
    saveBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Empêche le comportement par défaut (soumission du formulaire)

        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const dayRow = document.querySelector(`tr[data-day="${currentDay}"][data-week="${currentWeek}"]`);
        const timeSlot = dayRow.querySelector('.time-slot');

        // Convertir les heures en pourcentage (par rapport à 07h00 à 19h00)
        const startHour = parseInt(startTime.split(':')[0]) + parseInt(startTime.split(':')[1]) / 60;
        const endHour = parseInt(endTime.split(':')[0]) + parseInt(endTime.split(':')[1]) / 60;
        const totalHours = 12; // De 07:00 à 19:00

        const startPercent = ((startHour - 7) / totalHours) * 100;
        const endPercent = ((endHour - 7) / totalHours) * 100;
        const widthPercent = endPercent - startPercent;

        // Réinitialiser le créneau
        timeSlot.innerHTML = '';

        // Créer une div qui représente la plage horaire choisie
        const timeBlock = document.createElement('div');
        timeBlock.className = 'time-block';
        timeBlock.style.left = `${startPercent}%`;
        timeBlock.style.width = `${widthPercent}%`;
        timeBlock.textContent = `${startTime} - ${endTime}`;

        // Ajouter la plage horaire à la cellule
        timeSlot.appendChild(timeBlock);

        modal.style.display = "none"; // Fermer la modale
    });

    // Fermer la modale en cliquant sur le bouton annuler
    cancelBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Fermer la modale en cliquant sur "X"
    document.querySelector('.close').addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Gestion du bouton "Ajouter une semaine de roulement"
    document.querySelector('.add-week').addEventListener('click', () => {
        currentWeek++; // Incrémenter le compteur de semaines
        createPlanningTable(currentWeek); // Créer un nouveau planning pour la nouvelle semaine
    });

    // Afficher la première section et le planning initial
    showSection(currentSection);
    createPlanningTable(currentWeek); // Générer la première semaine par défaut

    document.querySelector('.submit-btn').addEventListener('click', function(event) {
        event.preventDefault();  // Empêche l'envoi par défaut du formulaire

        // Récupérer les données du formulaire
        const prenom = document.getElementById('prenom').value;
        const nom = document.getElementById('nom').value;
        const dateNaissance = document.getElementById('date_naissance').value;
        const lieuNaissance = document.getElementById('lieu_naissance').value;
        const genre = document.getElementById('genre').value;

        const debutContrat = document.getElementById('debut_contrat').value;
        const finContrat = document.getElementById('fin_contrat').value;
        const isFlexible = document.getElementById('flexible').checked ? "Oui" : "Non";

        // Récupérer les informations des parents
        const prenomParent = document.getElementById('prenom_parent').value;
        const nomParent = document.getElementById('nom_parent').value;
        const emailParent = document.getElementById('email_parent').value;
        const allocataire = document.getElementById('allocataire').value;
        const telephoneFixe = document.getElementById('telephone_fixe').value;
        const telephonePortable = document.getElementById('telephone_portable').value;
        const adresseParent = document.getElementById('adresse_parent').value;
        const codePostal = document.getElementById('code_postal').value;
        const ville = document.getElementById('ville').value;
        const pays = document.getElementById('pays').value;
        const revenuAnnuel = document.getElementById('revenu_annuel').value;
        const profession = document.getElementById('profession').value;
        const relationParent = document.getElementById('relation_parent').value;
        const contratEntreprise = document.getElementById('contrat_entreprise').value;
        const comments = document.getElementById('comments').value;

        // Récupérer le planning (toutes les semaines ajoutées)
        const planningTables = document.querySelectorAll('.planning-table');
        let planningData = [];

        planningTables.forEach((table, weekIndex) => {
            const rows = table.querySelectorAll('tr');
            rows.forEach((row) => {
                const day = row.getAttribute('data-day');
                const week = row.getAttribute('data-week');
                const timeSlot = row.querySelector('.time-slot .time-block');
                if (timeSlot) {
                    planningData.push({
                        week: week,
                        day: day,
                        time: timeSlot.textContent
                    });
                }
            });
        });

        // Create the planning message
        let planningMessage = planningData.map(entry => `Semaine ${entry.week} - ${entry.day}: ${entry.time}`).join('\n');

        // Email details
        const emailBody = `
        <h3>Infos Enfant</h3>
        <p><b>Prénom:</b> ${prenom}</p>
        <p><b>Nom:</b> ${nom}</p>
        <p><b>Date de naissance:</b> ${dateNaissance}</p>
        <p><b>Lieu de naissance:</b> ${lieuNaissance}</p>
        <p><b>Genre:</b> ${genre}</p>

        <h3>Contrat</h3>
        <p><b>Début du contrat:</b> ${debutContrat}</p>
        <p><b>Fin du contrat:</b> ${finContrat}</p>
        <p><b>Planning flexible:</b> ${isFlexible}</p>

        <h3>Infos Parent</h3>
        <p><b>Relation avec l'enfant:</b> ${relationParent}</p>
        <p><b>Prénom Parent:</b> ${prenomParent}</p>
        <p><b>Nom Parent:</b> ${nomParent}</p>
        <p><b>Email Parent:</b> ${emailParent}</p>
        <p><b>Téléphone Fixe:</b> ${telephoneFixe}</p>
        <p><b>Téléphone Portable:</b> ${telephonePortable}</p>
        <p><b>Adresse:</b> ${adresseParent}</p>
        <p><b>Code Postal:</b> ${codePostal}</p>
        <p><b>Ville:</b> ${ville}</p>
        <p><b>Pays:</b> ${pays}</p>
        <p><b>Revenu Annuel:</b> ${revenuAnnuel}</p>
        <p><b>Profession:</b> ${profession}</p>
        <p><b>Contrat d'entreprise:</b> ${contratEntreprise}</p>

        <h3>Planning</h3>
        <pre>${planningMessage}</pre>
        
        <h3>Informations supplémentaires</h3>
        <p>${comments}</p>
    `;

        // Send the email using SMTPJS
        Email.send({
            Host : "smtp.elasticemail.com",
            Username : "florianverstraete45@gmail.com",
            Password : "DD6BFC71C15F7143554DFDF70E82C4EDCE52",
            To : 'florianverstraete45@gmail.com',
            From : "florianverstraete45@gmail.com",
            Subject : "Préinscription",
            Body: emailBody
        }).then(
            message => alert(message)
        );

    });


});













