// Application principale
const App = {
    init() {
        this.loadTemplates();
        this.setupEventListeners();
        console.log('🚀 ViralContent Pro démarré');
    },

    setupEventListeners() {
        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                generateContent();
            }
        });
    },

    loadTemplates() {
        const templates = [
            {
                title: "🧵 Thread Éducation",
                desc: "Transformer un concept complexe en thread pédagogique",
                icon: "📚",
                preview: "Comment fonctionne réellement l'algorithme [Plateforme]..."
            },
            {
                title: "💼 Story LinkedIn",
                desc: "Votre parcours en post engageant",
                icon: "🚀",
                preview: "Il y a 2 ans, j'étais [situation]. Aujourd'hui [résultat]..."
            },
            {
                title: "📸 Carrousel Instagram",
                desc: "5 slides éducatives virales",
                icon: "🎨",
                preview: "5 erreurs qui tuent votre [objectif] (sauvegardez ça)..."
            },
            {
                title: "🎵 Script TikTok",
                desc: "Format storytelling 30 secondes",
                icon: "⏱️",
                preview: "POV : Tu découvres enfin pourquoi [problème]..."
            },
            {
                title: "🔄 Contenu Évergreen",
                desc: "Reformater un article en multi-posts",
                icon: "♻️",
                preview: "Le meilleur contenu de mon blog résumé en posts..."
            },
            {
                title: "⚡ Hot Take Twitter",
                desc: "Opinion controverse pour engagement",
                icon: "🔥",
                preview: "Unpopular opinion : [sujet] n'est pas ce que vous croyez..."
            }
        ];

        const container = document.getElementById('templates');
        templates.forEach(t => {
            const div = document.createElement('div');
            div.className = 'bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer border-2 border-transparent hover:border-purple-500';
            div.onclick = () => this.useTemplate(t.preview);
            div.innerHTML = `
                <div class="text-3xl mb-2">${t.icon}</div>
                <h4 class="font-bold text-gray-800 mb-1">${t.title}</h4>
                <p class="text-sm text-gray-600">${t.desc}</p>
            `;
            container.appendChild(div);
        });
    },

    useTemplate(text) {
        document.getElementById('inputContent').value = text;
        document.getElementById('inputContent').focus();
    },

    generate() {
        const input = document.getElementById('inputContent').value;
        const type = document.getElementById('contentType').value;
        const addEmojis = document.getElementById('addEmojis').checked;
        const addHooks = document.getElementById('addHooks').checked;

        if (!input.trim()) {
            alert('Veuillez entrer du contenu à transformer !');
            return;
        }

        let results = [];
        const options = { addEmojis, addHooks };

        switch(type) {
            case 'thread':
                results = Transformers.createThread(input, options);
                break;
            case 'linkedin':
                results = Transformers.createLinkedInPost(input, options);
                break;
            case 'instagram':
                results = Transformers.createInstagramCaption(input, options);
                break;
            case 'tiktok':
                results = Transformers.createTikTokScript(input, options);
                break;
        }

        this.displayResults(results, type);
        this.trackGeneration(type);
    },

    displayResults(results, platform) {
        const container = document.getElementById('outputContent');
        const statsDiv = document.getElementById('viralStats');
        
        container.innerHTML = '';
        
        results.forEach((result, index) => {
            const div = document.createElement('div');
            div.className = 'bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500 relative group';
            
            const score = Transformers.calculateViralScore(result, platform);
            
            div.innerHTML = `
                <pre class="whitespace-pre-wrap text-sm text-gray-800 font-sans">${result}</pre>
                <div class="mt-2 flex justify-between items-center">
                    <span class="text-xs text-purple-600 font-semibold">Score: ${score}/100</span>
                    <button onclick="copyText(this)" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition">
                        Copier
                    </button>
                </div>
            `;
            container.appendChild(div);
        });

        // Afficher stats globales
        const avgScore = Math.round(results.reduce((a, r) => a + Transformers.calculateViralScore(r, platform), 0) / results.length);
        document.getElementById('viralScore').textContent = avgScore;
        statsDiv.classList.remove('hidden');
    },

    copyAll() {
        const outputs = document.querySelectorAll('#outputContent pre');
        const text = Array.from(outputs).map(pre => pre.textContent).join('\n\n---\n\n');
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Tout le contenu a été copié !');
        });
    },

    copyText(btn) {
        const pre = btn.closest('div').previousElementSibling;
        navigator.clipboard.writeText(pre.textContent).then(() => {
            btn.textContent = '✅ Copié !';
            setTimeout(() => btn.textContent = 'Copier', 2000);
        });
    },

    showPremium() {
        document.getElementById('premiumModal').classList.remove('hidden');
        document.getElementById('premiumModal').classList.add('flex');
    },

    closePremium() {
        document.getElementById('premiumModal').classList.add('hidden');
        document.getElementById('premiumModal').classList.remove('flex');
    },

    // Tracking simple pour analytics
    trackGeneration(type) {
        const count = parseInt(localStorage.getItem(`gen_${type}`) || 0) + 1;
        localStorage.setItem(`gen_${type}`, count);
        console.log(`Génération ${type} #${count}`);
    }
};

// Fonctions globales
function generateContent() {
    App.generate();
}

function copyAll() {
    App.copyAll();
}

function copyText(btn) {
    App.copyText(btn);
}

function showPremium() {
    App.showPremium();
}

function closePremium() {
    App.closePremium();
}

// Démarrer
document.addEventListener('DOMContentLoaded', () => App.init());
