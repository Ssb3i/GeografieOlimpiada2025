/**
 * Ghid Simplu Pregătire Cutremur
 * Ghiduri vizuale interactive pentru siguranța în caz de cutremur
 */

class EarthquakeGuide {
    constructor() {
        this.currentPhase = 'before';
        this.contentElement = document.getElementById('content');
        this.navTabs = document.querySelectorAll('.nav-tab');
        
        this.init();
    }

    init() {
        // Add click listeners to navigation tabs
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const phase = e.target.dataset.phase;
                this.switchPhase(phase);
            });
        });

        // Load initial phase
        this.loadPhase(this.currentPhase);
    }

    switchPhase(phase) {
        this.currentPhase = phase;
        
        // Update active tab
        this.navTabs.forEach(tab => {
            tab.classList.remove('nav-tab--active');
            if (tab.dataset.phase === phase) {
                tab.classList.add('nav-tab--active');
            }
        });

        // Load phase content
        this.loadPhase(phase);
    }

    loadPhase(phase) {
        this.contentElement.innerHTML = this.getLoadingHTML();
        
        // Simulate loading delay for better UX
        setTimeout(() => {
            this.contentElement.innerHTML = this.getPhaseHTML(phase);
            this.addInteractivity();
        }, 300);
    }

    getLoadingHTML() {
        return `
            <div class="loading">
                <div class="loading-spinner"></div>
                <p>Se încarcă conținutul...</p>
            </div>
        `;
    }

    getPhaseHTML(phase) {
        const phaseData = this.getPhaseData(phase);
        
        return `
            <h2 class="phase-title">${phaseData.title}</h2>
            <p class="phase-description">${phaseData.description}</p>
            
            <div class="interactive-grid">
                ${phaseData.items.map(item => `
                    <div class="interactive-item" data-item="${item.id}">
                        <span class="item-icon">${item.icon}</span>
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-details" id="details-${item.id}">
                            <strong>De ce este important:</strong>
                            <p>${item.details}</p>
                            ${item.tips ? `<br><strong>Sfaturi:</strong><ul>${item.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="progress-info">
                <p class="progress-text">Apasă pe fiecare element pentru a afla mai multe despre măsurile de siguranță în caz de cutremur</p>
            </div>
        `;
    }

    getPhaseData(phase) {
        const phases = {
            before: {
                title: "🏠 Înainte de Cutremur",
                description: "Pregătirea este esențială pentru a rămâne în siguranță în timpul unui cutremur. Învață ce să faci din timp.",
                items: [
                    {
                        id: "emergency-kit",
                        icon: "🎒",
                        title: "Kit de Urgență",
                        description: "Pregătește un kit de urgență complet pentru familia ta",
                        details: "Un kit de urgență îți asigură proviziile esențiale când serviciile normale sunt întrerupte. Stochează suficiente provizii pentru cel puțin 72 de ore.",
                        tips: [
                            "Apă: 1 galon pe persoană pe zi",
                            "Mâncare neperisabilă pentru 3+ zile",
                            "Radio cu baterii sau cu manivela",
                            "Lanternă și baterii suplimentare",
                            "Trusă de prim ajutor și medicamente"
                        ]
                    },
                    {
                        id: "secure-furniture",
                        icon: "🪑",
                        title: "Fixarea Obiectelor Grele",
                        description: "Ancorează mobilierul și obiectele grele pentru a preveni căderea",
                        details: "Mobilierul și aparatele nefixate pot deveni proiectile periculoase în timpul unui cutremur, cauzând răni grave.",
                        tips: [
                            "Fixează mobilierul înalt de pereți",
                            "Folosește zăvoare de siguranță la dulapuri",
                            "Fixează încălzitoarele de apă și aparatele pe gaz",
                            "Instalează folie de siguranță pe ferestre",
                            "Păstrează obiectele grele pe rafturile de jos"
                        ]
                    },
                    {
                        id: "evacuation-plan",
                        icon: "🗺️",
                        title: "Plan de Evacuare",
                        description: "Creează și exersează rutele de evacuare pentru familie",
                        details: "Să ai un plan clar îi ajută pe toți să știe ce să facă și unde să meargă, reducând panica și confuzia în timpul unei urgențe.",
                        tips: [
                            "Identifică locurile sigure din fiecare cameră",
                            "Planifică mai multe rute de evacuare",
                            "Alege puncte de întâlnire în afara casei",
                            "Exersează cu toți membrii familiei",
                            "Păstrează documentele importante accesibile"
                        ]
                    },
                    {
                        id: "communication-plan",
                        icon: "📱",
                        title: "Plan de Comunicare",
                        description: "Stabilește cum se vor contacta membrii familiei între ei",
                        details: "Rețelele de comunicare pot fi întrerupte în timpul dezastrelor. Să ai un plan asigură că membrii familiei se pot reconecta.",
                        tips: [
                            "Alege o persoană de contact din afara statului",
                            "Asigură-te că toți știu numerele importante de telefon",
                            "Ia în considerare rețelele sociale și aplicațiile de mesagerie",
                            "Programează contacte ICE (În Caz de Urgență)",
                            "Păstrează copii scrise ale numerelor importante"
                        ]
                    }
                ]
            },
            during: {
                title: "⚡ În Timpul Cutremurului",
                description: "Când pământul începe să se cutremure, să știi ce să faci îți poate salva viața. Urmează metoda Lasă-te, Acoperă-te și Ține-te.",
                items: [
                    {
                        id: "drop-cover-hold",
                        icon: "🫳",
                        title: "Lasă-te, Acoperă-te și Ține-te",
                        description: "Acțiunea principală de siguranță în timpul cutremurului",
                        details: "Aceasta este cea mai eficientă modalitate de a te proteja în timpul cutremurului. S-a dovedit că salvează vieți și reduce rănile.",
                        tips: [
                            "LASĂ-TE pe mâini și genunchi imediat",
                            "ACOPERĂ-TE sub un birou sau masă solidă",
                            "ȚINE-TE de adăpost și protejează-ți capul",
                            "Dacă nu există masă, acoperă capul și gâtul cu brațele",
                            "Rămâi unde ești până când se oprește cutremurul"
                        ]
                    },
                    {
                        id: "indoor-safety",
                        icon: "🏠",
                        title: "Siguranța în Interior",
                        description: "Ce să faci dacă ești într-o clădire",
                        details: "Majoritatea rănilor apar de la obiecte și resturi care cad. A rămâne înăuntru și a te adăposti este de obicei mai sigur decât să încerci să fugi afară.",
                        tips: [
                            "Nu fugi afară în timpul cutremurului",
                            "Stai departe de ferestre și oglinzi",
                            "Nu sta în pragul ușii",
                            "Intră sub o masă solidă dacă este posibil",
                            "Stai departe de mobilierul înalt care poate cădea"
                        ]
                    },
                    {
                        id: "outdoor-safety",
                        icon: "🌳",
                        title: "Siguranța în Exterior",
                        description: "Acțiuni de luat dacă ești afară în timpul cutremurului",
                        details: "Zonele exterioare pot fi mai sigure, dar tot trebuie să te protejezi de resturile care cad și alte pericole.",
                        tips: [
                            "Îndepărtează-te de clădiri și cabluri electrice",
                            "Lasă-te pe pământ și acoperă-ți capul",
                            "Stai departe de ferestre și fațade",
                            "Evită podurile și pasajele",
                            "Fii atent la sticla și resturile care cad"
                        ]
                    },
                    {
                        id: "vehicle-safety",
                        icon: "🚗",
                        title: "Într-un Vehicul",
                        description: "Cum să rămâi în siguranță dacă conduci în timpul cutremurului",
                        details: "Vehiculele pot oferi protecție, dar trebuie să te oprești în siguranță și să eviți anumite zone care devin periculoase în timpul cutremurelor.",
                        tips: [
                            "Oprește-te în siguranță și stai",
                            "Evită podurile, pasajele și tunelurile",
                            "Rămâi în vehicul",
                            "Pornește luminile de avarie",
                            "Așteaptă să se oprească cutremurul înainte de a continua"
                        ]
                    }
                ]
            },
            after: {
                title: "🔍 După Cutremur",
                description: "Odată ce se oprește cutremurul, există pași importanți pentru a asigura siguranța continuă și a începe recuperarea.",
                items: [
                    {
                        id: "immediate-safety",
                        icon: "⚠️",
                        title: "Verificarea Imediată a Siguranței",
                        description: "Primele acțiuni de luat când se oprește cutremurul",
                        details: "Primele minute după un cutremur sunt critice pentru asigurarea siguranței imediate și prevenirea altor răni.",
                        tips: [
                            "Verifică-te pe tine și pe alții pentru răni",
                            "Caută pericole precum scurgeri de gaz sau daune electrice",
                            "Pune-ți încălțămintea pentru a te proteja de sticla spartă",
                            "Pornește radioul cu baterii pentru informații",
                            "Folosește lanterne, nu lumânări sau chibrituri"
                        ]
                    },
                    {
                        id: "building-inspection",
                        icon: "🏗️",
                        title: "Inspectează Clădirea",
                        description: "Verifică daunele structurale înainte de a rămâne înăuntru",
                        details: "Clădirile pot fi slăbite chiar dacă par intacte. Verificarea daunelor ajută la prevenirea rănilor de la prăbușiri întârziate.",
                        tips: [
                            "Caută fisuri în pereți și fundație",
                            "Verifică conductele de gaz, apă sau electrice sparte",
                            "Inspectează coșurile pentru daune",
                            "Dacă clădirea este avariată, evacuează în siguranță",
                            "Nu folosi lifturile"
                        ]
                    },
                    {
                        id: "aftershocks",
                        icon: "📳",
                        title: "Pregătește-te pentru Replici",
                        description: "Fii gata pentru activitatea seismică suplimentară",
                        details: "Replicile sunt cutremure mai mici care urmează evenimentul principal. Pot cauza daune suplimentare structurilor deja slăbite.",
                        tips: [
                            "Așteaptă-te la replici timp de zile sau săptămâni",
                            "Fiecare replică necesită Lasă-te, Acoperă-te, Ține-te",
                            "Stai departe de clădirile avariate",
                            "Păstrează proviziile de urgență accesibile",
                            "Fii pregătit să evacuezi dacă este necesar"
                        ]
                    },
                    {
                        id: "communication",
                        icon: "📞",
                        title: "Verifică și Obține Informații",
                        description: "Contactează persoanele dragi și rămâi informat",
                        details: "Comunicarea ajută la asigurarea siguranței tuturor și oferă informații importante despre pericolele în curs și eforturile de răspuns.",
                        tips: [
                            "Contactează persoana de urgență din afara statului",
                            "Trimite mesaje scurte pentru a conserva bateria",
                            "Ascultă transmisiunile de urgență",
                            "Verifică vecinii, în special pe cei în vârstă",
                            "Evită folosirea telefonului decât pentru urgențe"
                        ]
                    }
                ]
            }
        };

        return phases[phase];
    }

    addInteractivity() {
        const items = document.querySelectorAll('.interactive-item');
        let clickedCount = 0;
        
        items.forEach(item => {
            item.addEventListener('click', () => {
                const itemId = item.dataset.item;
                const details = document.getElementById(`details-${itemId}`);
                
                if (!item.classList.contains('clicked')) {
                    item.classList.add('clicked');
                    details.classList.add('visible');
                    clickedCount++;
                    
                    this.updateProgress(clickedCount, items.length);
                } else {
                    item.classList.remove('clicked');
                    details.classList.remove('visible');
                    clickedCount--;
                    
                    this.updateProgress(clickedCount, items.length);
                }
            });
        });
    }

    updateProgress(completed, total) {
        const progressInfo = document.querySelector('.progress-info');
        
        if (completed === total) {
            progressInfo.innerHTML = `
                <div class="success-message">
                    🎉 Felicitări! Ai învățat toate măsurile importante de siguranță pentru această fază.
                    ${total < 4 ? 'Încearcă să explorezi și celelalte faze pentru a afla mai multe!' : ''}
                </div>
            `;
        } else {
            progressInfo.innerHTML = `
                <p class="progress-text">
                    Progres: ${completed}/${total} elemente explorate
                    ${completed > 0 ? '- Continuă să apeși pentru a afla mai multe!' : '- Apasă pe fiecare element pentru a afla mai multe despre măsurile de siguranță în caz de cutremur'}
                </p>
            `;
        }
    }
}

// Initialize the guide when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new EarthquakeGuide();
});
