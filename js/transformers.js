// ViralContent Pro - Transformers Engine v2.0
// Algorithme intelligent de génération de contenu viral

const Transformers = {
    // Base de données de hooks contextuels par catégorie
    hooks: {
        business: [
            "J'ai découvert la méthode que les top 1% utilisent en secret...",
            "Ce levier business a changé mon chiffre d'affaires x10 :",
            "L'erreur qui coûte 10k€ par mois à 90% des entrepreneurs :",
            "Comment j'ai automatisé 80% de mon business en 30 jours :",
            "Le framework exact pour passer de 0 à 100k€/an :"
        ],
        marketing: [
            "L'algorithme fonctionne différemment de ce que tu penses :",
            "Cette stratégie de contenu génère 10x plus d'engagement :",
            "Pourquoi ta stratégie marketing ne fonctionne pas (et le fix) :",
            "Le secret des créateurs qui explosent en 2025 :",
            "3 tweaks qui ont fait passer mon contenu de 0 à viral :"
        ],
        productivity: [
            "Comment je fais en 2h ce que les autres font en 8h :",
            "Le système qui m'a permis de gagner 15h par semaine :",
            "Arrête de gérer ton temps comme ça. Voici la méthode 80/20 :",
            "Pourquoi la productivité traditionnelle est un piège :",
            "Mon workflow exact pour créer 30 jours de contenu en 2h :"
        ],
        mindset: [
            "La vérité sur le succès que personne ne veut t'entendre dire :",
            "Ce que j'aurais aimé savoir avant de commencer :",
            "Pourquoi 95% abandonnent avant le succès :",
            "La mentalité qui change tout (thread) :",
            "Ce que 5 ans d'échecs m'ont appris sur la réussite :"
        ],
        tech: [
            "Cet outil IA a remplacé 3 freelances dans mon équipe :",
            "La stack tech qui m'a permis de scaler sans code :",
            "Pourquoi les développeurs utilisent déjà ça en 2025 :",
            "Automatisation niveau expert : mon workflow no-code :",
            "L'outil caché que les startups utilisent pour scaler :"
        ],
        default: [
            "J'ai découvert quelque chose d'incroyable...",
            "Personne ne parle de ça, mais c'est game-changing :",
            "Voici la vérité que personne ne veut vous dire :",
            "3 choses que j'aurais aimé savoir avant de commencer :",
            "Ça m'a pris 5 ans à comprendre. Voici le résumé :"
        ]
    },

    // Emojis par plateforme et contexte
    emojis: {
        thread: {
            start: ['🧵', '👇', '🔥', '💡', '🚨'],
            middle: ['⚡', '📊', '💰', '🎯', '✅'],
            end: ['🚀', '💪', '🔑', '⭐', '🎉']
        },
        linkedin: ['💼', '📈', '🚀', '💡', '🎯', '✅', '🔥', '⚡', '📊', '💪', '🏆', '🌟'],
        instagram: ['📸', '✨', '🔥', '💫', '🌟', '💖', '🎯', '🚀', '💡', '🎨', '📱', '💎'],
        tiktok: ['🎵', '🔥', '✨', '💯', '😱', '🤯', '💡', '🎯', '⚡', '🚀', '👀', '🎬']
    },

    // Détecter la catégorie du contenu
    detectCategory(text) {
        const lower = text.toLowerCase();
        const categories = {
            business: ['business', 'entrepreneur', 'chiffre', 'client', 'vente', 'marketing', 'revenu', 'argent', 'startup', 'saas'],
            marketing: ['marketing', 'algorithme', 'engagement', 'viral', 'audience', 'followers', 'reach', 'impressions'],
            productivity: ['productivité', 'temps', 'workflow', 'automatisation', 'efficacité', 'habitudes', 'routine', 'focus'],
            mindset: ['mindset', 'succès', 'échec', 'motivation', 'discipline', 'mental', 'confiance', 'peur', 'limitante'],
            tech: ['outil', 'logiciel', 'ia', 'automatiser', 'no-code', 'tech', 'application', 'software', 'ai', 'gpt']
        };
        
        let scores = {};
        for (let [cat, keywords] of Object.entries(categories)) {
            scores[cat] = keywords.filter(k => lower.includes(k)).length;
        }
        
        const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
        return best[1] > 0 ? best[0] : 'default';
    },

    // Extraire les phrases clés intelligentement
    extractKeyPoints(text, count = 5) {
        // Nettoyer le texte
        const clean = text.replace(/\s+/g, ' ').trim();
        
        // Découper en phrases
        const sentences = clean.match(/[^\.!\?]+[\.!\?]+/g) || [clean];
        
        // Score chaque phrase
        const scored = sentences.map(sentence => {
            let score = 0;
            const lower = sentence.toLowerCase();
            
            // Mots qui indiquent de l'importance
            const importantWords = ['important', 'clé', 'essentiel', 'crucial', 'vital', 'stratégie', 'méthode', 'secret', 'astuce', 'conseil', 'pourquoi', 'comment', 'quand', 'où'];
            importantWords.forEach(word => {
                if (lower.includes(word)) score += 2;
            });
            
            // Chiffres = concret
            if (/\d+/.test(sentence)) score += 3;
            
            // Longueur idéale (ni trop court ni trop long)
            const len = sentence.length;
            if (len > 30 && len < 150) score += 2;
            
            // Éviter les phrases trop vagues
            const vagueWords = ['chose', 'truc', 'quelque chose', 'etc', 'bla'];
            vagueWords.forEach(word => {
                if (lower.includes(word)) score -= 2;
            });
            
            return { sentence: sentence.trim(), score };
        });
        
        // Trier et prendre les meilleures
        return scored
            .sort((a, b) => b.score - a.score)
            .slice(0, count)
            .map(s => s.sentence);
    },

    // Créer un thread Twitter optimisé
    createThread(text, options = {}) {
        const category = this.detectCategory(text);
        const keyPoints = this.extractKeyPoints(text, 5);
        const hooks = this.hooks[category] || this.hooks.default;
        
        let tweets = [];
        
        // Hook d'ouverture
        let hook = hooks[Math.floor(Math.random() * hooks.length)];
        if (options.addEmojis) {
            hook += ' ' + this.emojis.thread.start[Math.floor(Math.random() * this.emojis.thread.start.length)];
        }
        tweets.push(hook);
        
        // Introduction
        if (keyPoints.length > 0) {
            let intro = "Voici ce que tu vas apprendre :\n\n";
            keyPoints.slice(0, 3).forEach((point, i) => {
                intro += `${i + 1}. ${point.substring(0, 80)}${point.length > 80 ? '...' : ''}\n`;
            });
            if (options.addEmojis) {
                intro += '\n' + this.emojis.thread.middle[0];
            }
            tweets.push(intro);
        }
        
        // Développement des points clés
        keyPoints.forEach((point, index) => {
            if (index === 0) return; // Déjà utilisé dans l'intro
            
            let tweet = point;
            
            // Ajouter du contexte si la phrase est courte
            if (point.length < 100) {
                tweet += '\n\n👉 Concrètement : applique ça dès aujourd\'hui.';
            }
            
            if (options.addEmojis) {
                const emoji = this.emojis.thread.middle[index % this.emojis.thread.middle.length];
                tweet += ' ' + emoji;
            }
            
            // Découper si trop long
            if (tweet.length > 270) {
                const parts = this.splitLongText(tweet, 270);
                tweets.push(...parts);
            } else {
                tweets.push(tweet);
            }
        });
        
        // Conclusion avec CTA
        let conclusion = "Récapitulons :\n\n";
        keyPoints.slice(0, 3).forEach((point, i) => {
            conclusion += `${i + 1}️⃣ ${point.substring(0, 50)}${point.length > 50 ? '...' : ''}\n`;
        });
        conclusion += '\nQuel point tu vas appliquer en premier ? 👇';
        
        if (options.addEmojis) {
            conclusion += ' ' + this.emojis.thread.end[Math.floor(Math.random() * this.emojis.thread.end.length)];
        }
        tweets.push(conclusion);
        
        // Numéroter les tweets
        return tweets.map((tweet, i) => {
            return `${i + 1}/${tweets.length} ${tweet}`;
        });
    },

    // Créer un post LinkedIn professionnel
    createLinkedInPost(text, options = {}) {
        const category = this.detectCategory(text);
        const keyPoints = this.extractKeyPoints(text, 3);
        const hooks = this.hooks[category] || this.hooks.default;
        
        // Structure LinkedIn : Story + Lesson + CTA
        
        let post = "";
        
        // Hook
        if (options.addHooks) {
            post += hooks[Math.floor(Math.random() * hooks.length)] + "\n\n";
        }
        
        // Story/Contexte
        post += "Il y a quelque temps, j'ai fait une découverte qui a tout changé.\n\n";
        
        // Les points clés formatés
        keyPoints.forEach((point, i) => {
            const emoji = options.addEmojis ? this.emojis.linkedin[i % this.emojis.linkedin.length] + ' ' : '';
            post += `${emoji}${point}\n\n`;
        });
        
        // Leçon/Learning
        post += "💡 Leçon apprise : " + (keyPoints[0] ? "L'action régulière bat la perfection occasionnelle." : "Teste, itère, améliore.") + "\n\n";
        
        // Preuve sociale/Exemple
        post += "Résultat : " + (category === 'business' ? "x3 sur mes conversions en 90 jours." : 
                                 category === 'productivity' ? "15h économisées par semaine." : 
                                 "Un impact mesurable sur mes objectifs.") + "\n\n";
        
        // CTA engageant
        post += "👉 Quelle est TA stratégie sur ce sujet ? Partage en commentaires, je réponds à tout le monde.\n\n";
        
        // Hashtags
        const hashtags = {
            business: '#entrepreneuriat #business #croissance',
            marketing: '#marketingdigital #contentstrategy #socialmedia',
            productivity: '#productivité #efficacité #timemanagement',
            mindset: '#mindset #succès #développementpersonnel',
            tech: '#technologie #innovation #productivité',
            default: '#créateurdecontenu #entrepreneuriat #growth'
        };
        
        if (options.addEmojis) {
            post += this.emojis.linkedin[Math.floor(Math.random() * this.emojis.linkedin.length)] + ' ';
        }
        post += hashtags[category] || hashtags.default;
        
        return [post];
    },

    // Créer une légende Instagram
    createInstagramCaption(text, options = {}) {
        const category = this.detectCategory(text);
        const hooks = this.hooks[category] || this.hooks.default;
        const keyPoints = this.extractKeyPoints(text, 2);
        
        // Hook visuel
        let caption = hooks[Math.floor(Math.random() * hooks.length)] + "\n\n";
        
        // Corps avec sauts de ligne pour lisibilité
        const body = keyPoints[0] || text.substring(0, 150);
        caption += body + (body.length > 100 ? '' : '\n\n' + (keyPoints[1] || ''));
        caption += "\n\n";
        
        // CTA multi-niveaux (Instagram aime les engagements)
        caption += "Double-tap ❤️ si ça t'a parlé\n";
        caption += "Sauvegarde pour plus tard 📌\n";
        caption += "Tag un ami qui doit voir ça 👇\n\n";
        
        // Question pour les commentaires
        caption += "Question : " + (category === 'business' ? "Quel est ton objectif ce mois-ci ?" :
                                   category === 'productivity' ? "Quelle est ta méthode pour rester focus ?" :
                                   "Qu'est-ce qui te bloque actuellement ?") + "\n\n";
        
        // Hashtags stratégiques (mix populaires + niche)
        const baseTags = '#contentcreator #viral #tips #growth';
        const nicheTags = {
            business: '#entrepreneurlife #businessowner #successmindset',
            marketing: '#marketingtips #digitalmarketing #contentstrategy',
            productivity: '#productivityhacks #timemanagement #efficiency',
            mindset: '#mindsetmatters #successmindset #motivation',
            tech: '#tech #innovation #aitools',
            default: '#instagood #instadaily #creator'
        };
        
        if (options.addEmojis) {
            caption += this.emojis.instagram[Math.floor(Math.random() * this.emojis.instagram.length)] + ' ';
        }
        caption += baseTags + ' ' + (nicheTags[category] || nicheTags.default);
        
        return [caption];
    },

    // Créer un script TikTok optimisé
    createTikTokScript(text, options = {}) {
        const category = this.detectCategory(text);
        const hooks = this.hooks[category] || this.hooks.default;
        const keyPoint = this.extractKeyPoints(text, 1)[0] || text.substring(0, 100);
        
        // Structure TikTok : Hook immédiat + Problème + Solution + CTA
        
        let script = "🎬 SCRIPT TIKTOK - 30 SECONDES\n\n";
        
        // 0-3s : Hook ultra court (stop le scroll)
        const hook = hooks[Math.floor(Math.random() * hooks.length)];
        script += "🚨 ACCROCHE (0-3 sec):\n";
        script += hook.substring(0, 60) + (hook.length > 60 ? '...' : '') + "\n\n";
        
        // 3-10s : Problème/Contexte
        script += "😤 PROBLÈME (3-10 sec):\n";
        script += "\"Tu passes des heures à " + (category === 'productivity' ? 'travailler sans résultats' : 
                                               category === 'marketing' ? 'créer du contenu qui ne perce pas' : 
                                               'faire des efforts qui ne paient pas') + "...\"\n\n";
        
        // 10-25s : Solution/Valeur
        script += "💡 SOLUTION (10-25 sec):\n";
        script += keyPoint.substring(0, 120) + (keyPoint.length > 120 ? '...' : '') + "\n";
        script += "Voici comment j'ai fait 👇\n\n";
        
        // 25-30s : CTA fort
        script += "🎯 CTA (25-30 sec):\n";
        script += "\"Like et follow pour la partie 2 ! ";
        if (options.addEmojis) {
            script += this.emojis.tiktok[Math.floor(Math.random() * this.emojis.tiktok.length)];
        }
        script += "\"\n\n";
        
        // Notes de production
        script += "📝 NOTES:\n";
        script += "- Texte à l'écran sur chaque segment\n";
        script += "- Musique tendance (upbeat)\n";
        script += "- Transition rapide entre les parties\n";
        script += "- Montrer un résultat visuel à la fin";
        
        return [script];
    },

    // Aider à découper un texte trop long
    splitLongText(text, maxLength) {
        const parts = [];
        let current = '';
        
        const words = text.split(' ');
        for (let word of words) {
            if ((current + word).length > maxLength) {
                parts.push(current.trim());
                current = word + ' ';
            } else {
                current += word + ' ';
            }
        }
        if (current.trim()) parts.push(current.trim());
        
        return parts;
    },

    // Calculer un score de viralité réaliste
    calculateViralScore(text, platform) {
        let score = 50; // Base
        
        // 1. Longueur optimale par plateforme
        const lengths = {
            thread: { min: 200, max: 1000, ideal: 500 },
            linkedin: { min: 300, max: 1500, ideal: 800 },
            instagram: { min: 50, max: 500, ideal: 200 },
            tiktok: { min: 100, max: 400, ideal: 250 }
        };
        
        const len = text.length;
        const ideal = lengths[platform] || lengths.thread;
        
        if (len >= ideal.min && len <= ideal.max) {
            score += 15;
        } else if (len < ideal.min) {
            score -= 10;
        } else if (len > ideal.max * 1.5) {
            score -= 5;
        }
        
        // 2. Structure (sauts de ligne = lisibilité)
        const lineBreaks = (text.match(/\n/g) || []).length;
        if (lineBreaks >= 3 && lineBreaks <= 10) score += 10;
        
        // 3. Éléments engageants
        if (text.includes('?')) score += 5; // Question
        if (text.includes('!')) score += 3; // Exclamation
        if (/\d+%|\dx|x\d/i.test(text)) score += 8; // Chiffres concrets (10x, 50%, etc.)
        if (/\d+\s*(jours|semaines|mois|ans|€|\$)/i.test(text)) score += 5; // Durées/monnaie
        
        // 4. Call-to-action présent
        const ctas = ['commente', 'partage', 'like', 'sauvegarde', 'tag', 'dis-moi', 'qu\'en penses-tu', '👇', '👉'];
        if (ctas.some(cta => text.toLowerCase().includes(cta))) score += 10;
        
        // 5. Émojis (ni trop ni trop peu)
        const emojiCount = (text.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
        if (emojiCount >= 2 && emojiCount <= 8) score += 5;
        if (emojiCount > 15) score -= 5; // Trop d'emojis = spammy
        
        // 6. Hashtags (pour Instagram/Twitter)
        if (platform === 'instagram' || platform === 'thread') {
            const hashtags = (text.match(/#[\w]+/g) || []).length;
            if (hashtags >= 3 && hashtags <= 10) score += 5;
        }
        
        // 7. Hook fort au début
        const firstLine = text.split('\n')[0] || '';
        const strongOpeners = ['voici', 'découvre', 'secret', 'méthode', 'pourquoi', 'comment', 'arrête', 'j\'ai', 'tu dois'];
        if (strongOpeners.some(op => firstLine.toLowerCase().includes(op))) score += 8;
        
        // 8. Storytelling (mots de narration)
        const storyWords = ['il y a', 'quand j\'ai', 'avant', 'maintenant', 'résultat', 'alors que', 'pendant que'];
        if (storyWords.some(sw => text.toLowerCase().includes(sw))) score += 5;
        
        // Plafonner
        return Math.min(100, Math.max(0, Math.round(score)));
    }
};

// Export pour utilisation
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Transformers;
}
