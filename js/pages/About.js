import { store } from "../main.js";
import { fetchEditors } from "../content.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    template: `
        <main class="page-info">
            <h1>About</h1>

            <section class="info-card">
                <h2>What is the Random List?</h2>
                <p>
                    The Random List is a community project that collects the most random and funny
                    Geometry Dash levels and ranks them by difficulty. Levels can be short or long,
                    and they don't need to be rated. It also has a leaderboard and a roulette.
                </p>
                <p class="es">
                    La Random List es un proyecto de la comunidad que reúne los niveles más random y
                    chistosos de Geometry Dash y los ordena por dificultad. Los niveles pueden ser
                    cortos o largos y no necesitan tener rate. También tiene leaderboard y ruleta.
                </p>
            </section>

            <section class="info-card">
                <h2>Join us / Únete</h2>
                <p>Submit your level, send your records or just hang out with the community.</p>
                <p class="es">Envía tu nivel, manda tus récords o simplemente pásate por la comunidad.</p>
                <div class="info-links">
                    <a class="info-btn" href="https://discord.gg/sc8MGdHJaG" target="_blank">Discord</a>
                    <a class="info-btn" href="https://forms.gle/ugBSUkP5iN6CSgN19" target="_blank">Submit Record</a>
                    <router-link class="info-btn" to="/standards">Standards</router-link>
                </div>
            </section>

            <section class="info-card" v-if="editors && editors.length">
                <h2>List Staff</h2>
                <ol class="editors">
                    <li v-for="editor in editors">
                        <img :src="'/assets/' + roleIconMap[editor.role] + (store.dark ? '-dark' : '') + '.svg'" :alt="editor.role">
                        <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                        <p v-else>{{ editor.name }}</p>
                    </li>
                </ol>
            </section>

            <p class="info-note">
                Website layout made by
                <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a>.
            </p>
        </main>
    `,
    data: () => ({
        editors: [],
        roleIconMap,
        store,
    }),
    async mounted() {
        this.editors = await fetchEditors();
    },
};
