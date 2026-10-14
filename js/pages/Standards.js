export default {
    template: `
        <main class="page-info">
            <div class="info-head">
                <h1>Standards</h1>
                <div class="lang-toggle">
                    <button :class="{ active: lang === 'en' }" @click="lang = 'en'">EN</button>
                    <button :class="{ active: lang === 'es' }" @click="lang = 'es'">ES</button>
                </div>
            </div>

            <section class="info-card" v-for="section in sections">
                <h2>{{ section.title[lang] }}</h2>
                <ul class="rules compact">
                    <li v-for="rule in section.rules">{{ rule[lang] }}</li>
                </ul>
            </section>

            <p class="info-note">{{ note[lang] }}</p>
        </main>
    `,
    data: () => ({
        lang: (navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en",
        sections: [
            {
                title: { en: "Level Standards", es: "Requisitos de niveles" },
                rules: [
                    {
                        en: "Levels must be 100% original (no stolen parts from other levels) and physically possible.",
                        es: "Los niveles deben ser 100% originales (sin partes robadas de otros niveles) y físicamente posibles.",
                    },
                    {
                        en: "Short levels are no longer accepted.",
                        es: "Ya no se aceptan niveles cortos.",
                    },
                    {
                        en: "Core theme: levels must feature funny references, music or art. Poorly made layouts alone are not funny.",
                        es: "Tema principal: los niveles deben tener referencias, música o arte chistosos. Un layout mal hecho por sí solo no es chistoso.",
                    },
                    {
                        en: "The verification must be on YouTube, with in-game audio and audible clicks/taps. Using an anticheat is recommended.",
                        es: "La verificación debe estar en YouTube, con audio del juego y clics/golpes audibles. Se recomienda usar un anticheat.",
                    },
                    {
                        en: "Submit levels in the Discord server (#level-request) with the name, ID, creator and verification link.",
                        es: "Envía los niveles en el servidor de Discord (#level-request) con el nombre, ID, creador y link de verificación.",
                    },
                    {
                        en: "The staff decides the final position and can reject or remove levels.",
                        es: "El staff decide la posición final y puede rechazar o quitar niveles.",
                    },
                ],
            },
            {
                title: { en: "Record Standards", es: "Requisitos de récords" },
                rules: [
                    {
                        en: "No hacks (Noclip, Bot, Speedhack, etc.) and only unedited recordings.",
                        es: "Sin hacks (Noclip, Bot, Speedhack, etc.) y solo grabaciones sin editar.",
                    },
                    {
                        en: "The video must include source audio or clicks/taps.",
                        es: "El video debe incluir el audio original o los clics/golpes.",
                    },
                    {
                        en: "Show a previous attempt and the entire death animation before the completion, unless it is on the first attempt (Everyplay records are exempt).",
                        es: "Muestra un intento previo y la animación de muerte completa antes de la finalización, a menos que sea en el primer intento (Everyplay está exento).",
                    },
                    {
                        en: "The recording must show the player hitting the endwall, or the completion is invalid.",
                        es: "La grabación debe mostrar al jugador atravesando la pared final, o la finalización será invalidada.",
                    },
                    {
                        en: "No secret routes, bug routes or easy modes. Only the unmodified level counts.",
                        es: "Sin rutas secretas, bug routes ni easy modes. Solo cuenta el nivel sin modificar.",
                    },
                    {
                        en: "Main List levels accept records at the percentage shown on each level, Extended List levels require 100%, and Legacy levels no longer accept records.",
                        es: "Los niveles de la Main List aceptan récords con el porcentaje indicado en cada uno, los de la Extended List requieren 100% y los Legacy ya no aceptan récords.",
                    },
                    {
                        en: "Send your record with the Submit Record button at the top of the page.",
                        es: "Envía tu récord con el botón Submit Record de la parte superior de la página.",
                    },
                ],
            },
        ],
        note: {
            en: "This is a small project, so please be patient and avoid harassment. Thanks!",
            es: "Este proyecto es pequeño, por favor ten paciencia y no hostigues. ¡Gracias!",
        },
    }),
};
