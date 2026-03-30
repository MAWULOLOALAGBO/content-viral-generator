// Algorithmes de transformation de contenu - 100% local, sans API
const Transformers = {
    // Base de données de hooks viraux
    hooks: {
        curiosity: [
            "J'ai découvert quelque chose d'incroyable...",
            "Personne ne parle de ça, mais c'est game-changing :",
            "Voici la vérité que personne ne veut vous dire :",
            "3 choses que j'aurais aimé savoir avant de commencer :",
            "Ça m'a pris 5 ans à comprendre. Voici le résumé en 1 minute :"
        ],
        problem: [
            "Vous perdez du temps avec ça ? Voici la solution :",
            "Arrêtez de faire cette erreur immédiatement :",
            "Le problème avec [sujet] que tout le monde ignore :",
            "Pourquoi vos [résultats] stagnent (et comment fixer ça) :"
        ],
        result: [
            "Comment j'ai [résultat] en [temps] sans [obstacle]",
            "De [état A] à [état B] : mon parcours complet",
            "Le système qui m'a permis de [résultat]"
        ]
    },

    emojis: {
        thread: ['🧵', '👇', '🔥', '💡', '⚡', '🚀', '✨', '📊', '💰', '🎯'],
        linkedin: ['💼', '📈', '🚀', '💡', '🎯', '✅', '🔥', '⚡', '📊', '💪'],
        instagram: ['📸', '✨', '🔥', '💫', '🌟', '💖', '🎯', '🚀', '💡', '🎨'],
        tiktok: ['🎵', '🔥', '✨', '💯', '😱', '🤯', '💡', '🎯', '⚡', '🚀']
    },

    // Découper un texte en tweets
    createThread(text, options = {}) {
        const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
        let tweets = [];
        let currentTweet = "";
        
        sentences.forEach((sentence, index) => {
            const cleanSentence = sentence.trim();
            if ((currentTweet + cleanSentence).length > 240) {
                if (currentTweet) tweets.push(currentTweet.trim());
                currentTweet = cleanSentence;
            } else {
                currentTweet += " " + cleanSentence;
            }
        });
        
        if (currentTweet) tweets.push(currentTweet.trim());
        
        // Ajouter numérotation et emojis
        return tweets.map((tweet, i) => {
            let formatted = tweet;
            if (options.addEmojis && i === 0) {
                formatted = this.getRandomHook() + "\n\n" + formatted;
            }
            if (options.addEmojis) {
                formatted += " " + this.getRandomEmoji('thread');
            }
            return `${i + 1}/${tweets.length} ${formatted}`;
        });
    },

    // Générer un post LinkedIn
    createLinkedInPost(text, options = {}) {
        const lines = text.split('\n').filter(l => l.trim());
        let post = "";
        
        if (options.addHooks) {
            post += this.getRandomHook('problem') + "\n\n";
        }
        
        // Structure LinkedIn : Story + Lesson + CTA
        post += lines.slice(0, 3).join('\n\n') + "\n\n";
        post += "💡 Leçon apprise : " + (lines[3] || "Toujours tester et itérer") + "\n\n";
        post += "👉 Quelle est votre expérience avec ce sujet ? Partagez en commentaires !\n\n";
        
        if (options.addEmojis) {
            post += this.getRandomEmoji('linkedin') + " ";
            post += "#créateurdecontenu #entrepreneuriat #growth";
        }
        
        return [post];
    },

    // Générer légende Instagram
    createInstagramCaption(text, options = {}) {
        const hook = this.getRandomHook('curiosity');
        const body = text.substring(0, 100) + (text.length > 100 ? '...' : '');
        const cta = "Double-tap si tu es d'accord ! ❤️\nSauvegarde pour plus tard 📌\nTag quelqu'un qui doit voir ça 👇";
        
        let caption = `${hook}\n\n${body}\n\n${cta}\n\n`;
        
        if (options.addEmojis) {
            caption += this.getRandomEmoji('instagram') + " ";
        }
        
        caption += "#contentcreator #viral #tips #growth #instagood";
        
        return [caption];
    },

    // Générer script TikTok
    createTikTokScript(text, options = {}) {
        const hook = "ACCROCHE (0-3 sec): " + this.getRandomHook('problem');
        const problem = "PROBLÈME (3-10 sec): " + text.substring(0, 80);
        const solution = "SOLUTION (10-25 sec): Voici comment j'ai résolu ça...";
        const cta = "CTA (25-30 sec): Like et follow pour plus de tips ! 🔥";
        
        return [`${hook}\n\n${problem}\n\n${solution}\n\n${cta}`];
    },

    getRandomHook(type = 'curiosity') {
        const hooks = this.hooks[type] || this.hooks.curiosity;
        return hooks[Math.floor(Math.random() * hooks.length)];
    },

    getRandomEmoji(platform) {
        const emojis = this.emojis[platform] || this.emojis.thread;
        return emojis[Math.floor(Math.random() * emojis.length)];
    },

    // Calculer un "score de viralité" (gamification)
    calculateViralScore(text, platform) {
        let score = 50; // Base
        
        // Facteurs positifs
        if (text.length < 100) score += 10; // Concis
        if (text.includes('?')) score += 5; // Question engageante
        if (text.includes('!')) score += 5; // Exclamation
        if (/\d+/.test(text)) score += 10; // Chiffres (listes)
        if (text.split('\n').length > 3) score += 10; // Structure aérée
        
        // Bonus plateforme
        if (platform === 'thread' && text.includes('🧵')) score += 5;
        
        return Math.min(100, score);
    }
};
