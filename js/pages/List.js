import { store } from "../main.js";
import { embed } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
                <table class="list" v-if="list">
                    <template v-for="([level, err], i) in list">
                        <tr v-if="i === 4">
                            <td colspan="2" style="text-align: center; padding-top: 20px; padding-bottom: 10px;">
                                <p class="type-label-lg" style="color: #fca5a5; margin: 0; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px;">--- Extended List ---</p>
                            </td>
                        </tr>
                        
                        <tr v-if="i === 8">
                            <td colspan="2" style="text-align: center; padding-top: 20px; padding-bottom: 10px;">
                                <p class="type-label-lg" style="color: #9ca3af; margin: 0; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 2px;">--- Legacy List ---</p>
                            </td>
                        </tr>

                        <tr>
                            <td class="rank">
                                <p v-if="i + 1 <= 8" class="type-label-lg">#{{ i + 1 }}</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected == i, 'error': !level }">
                                <button @click="selected = i">
                                    <img v-if="level && thumb(level)" class="thumb" :src="thumb(level)" alt="" loading="lazy">
                                    <span class="type-label-lg">{{ level?.name || \`Error (\${err}.json)\` }}</span>
                                </button>
                            </td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="level-container">
                <div class="level" v-if="level">
                    <h1>{{ level.name }}</h1>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Password</div>
                            <p>{{ level.password || 'Free to Copy' }}</p>
                        </li>
                    </ul>
                    <h2>Records</h2>
                    <p v-if="selected + 1 <= 4"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected +1 <= 8"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else class="level" style="height: 100%; justify-content: center; align-items: center;">
                    <p>(ノಠ益ಠ)ノ彡┻━┻</p>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev/" target="_blank">TheShittyList</a></p>
                    </div>
                    <template v-if="editors">
                        <h3>List Editors</h3>
                        <ol class="editors">
                            <li v-for="editor in editors">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.link" class="type-label-lg link" target="_blank" :href="editor.link">{{ editor.name }}</a>
                                <p v-else>{{ editor.name }}</p>
                            </li>
                        </ol>
                    </template>
                    <h3>Quick rules / Reglas rápidas</h3>
                    <ul class="quick-rules">
                        <li>
                            <p>Original, possible, not short, and funny (references, music or art).</p>
                            <p class="es">Originales, posibles, no cortos y chistosos (referencias, música o arte).</p>
                        </li>
                        <li>
                            <p>Verification on YouTube, with game audio and audible clicks.</p>
                            <p class="es">Verificación en YouTube, con audio del juego y clics audibles.</p>
                        </li>
                        <li>
                            <p>Records: no hacks, unedited, with a previous attempt and the endwall.</p>
                            <p class="es">Récords: sin hacks ni ediciones, con intento previo y pared final.</p>
                        </li>
                        <li>
                            <p>No secret routes, bug routes or easy modes.</p>
                            <p class="es">Sin rutas secretas, bugs ni easy modes.</p>
                        </li>
                    </ul>
                    <router-link class="rules-link type-label-lg" to="/standards">Full rules / Reglas completas →</router-link>
                    <p class="type-label-md small-note">
                        Small project: please be patient and avoid harassment. / Proyecto pequeño: ten paciencia y no hostigues.
                    </p>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: 0,
        errors: [],
        roleIconMap,
        store
    }),
    computed: {
        level() {
            return this.list[this.selected][0];
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }

            return embed(
                this.toggledShowcase
                    ? this.level.showcase
                    : this.level.verification
            );
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        // Miniatura de YouTube a partir del link de verificación
        thumb(level) {
            const url = level?.verification || "";
            const m = url.match(
                /(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/
            );
            return m ? `https://img.youtube.com/vi/${m[1]}/mqdefault.jpg` : null;
        },
    },
};
