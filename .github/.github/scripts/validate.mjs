// Valida los archivos de la carpeta data/ antes de que rompan la página.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = "data";
const ROLES = ["owner", "admin", "helper", "dev", "trial"];
const errors = [];
const err = (msg) => errors.push(msg);

const isStr = (v) => typeof v === "string" && v.trim() !== "";
const isNum = (v) => typeof v === "number" && Number.isFinite(v);

function readJSON(file) {
    const path = join(DIR, file);
    if (!existsSync(path)) {
        err(`Falta el archivo ${path} (revisa mayúsculas y que termine en .json)`);
        return null;
    }
    try {
        return JSON.parse(readFileSync(path, "utf8"));
    } catch (e) {
        err(`${path}: JSON inválido -> ${e.message} (¿coma de más o de menos?)`);
        return null;
    }
}

function checkLevel(file, level) {
    const at = `${DIR}/${file}.json`;
    if (typeof level !== "object" || level === null || Array.isArray(level)) {
        return err(`${at}: debe ser un objeto { ... }`);
    }
    const idOk = isNum(level.id) || (isStr(level.id) && /^\d+$/.test(level.id));
    if (!idOk) err(`${at}: "id" debe ser un número`);
    if (!isStr(level.name)) err(`${at}: falta "name"`);
    if (!isStr(level.author)) err(`${at}: falta "author"`);
    if (!Array.isArray(level.creators)) err(`${at}: falta "creators" (usa [] si no hay más creadores)`);
    if (!isStr(level.verifier)) err(`${at}: falta "verifier"`);
    if (!isStr(level.verification) || !/^https?:\/\//.test(level.verification)) {
        err(`${at}: "verification" debe ser un link que empiece con http`);
    }
    if (!isNum(level.percentToQualify) || level.percentToQualify < 1 || level.percentToQualify > 100) {
        err(`${at}: "percentToQualify" debe ser un número entre 1 y 100`);
    }
    if (!Array.isArray(level.records)) {
        return err(`${at}: falta "records" (usa [] si no hay récords)`);
    }
    level.records.forEach((r, i) => {
        const rat = `${at} récord #${i + 1}`;
        if (!isStr(r?.user)) err(`${rat}: falta "user"`);
        if (!isStr(r?.link) || !/^https?:\/\//.test(r.link)) err(`${rat}: "link" debe empezar con http`);
        if (!isNum(r?.percent) || r.percent < 0 || r.percent > 100) err(`${rat}: "percent" debe ser un número entre 0 y 100`);
        if (!isNum(r?.hz)) err(`${rat}: "hz" debe ser un número`);
    });
}

// 1) _list.json y cada nivel que menciona
const list = readJSON("_list.json");
const used = new Set();
if (list) {
    if (!Array.isArray(list)) {
        err("data/_list.json debe ser una lista [ ... ]");
    } else {
        list.forEach((name, i) => {
            if (!isStr(name)) return err(`data/_list.json posición ${i + 1}: debe ser un texto entre comillas`);
            if (used.has(name)) err(`data/_list.json: "${name}" está repetido`);
            used.add(name);
            const level = readJSON(`${name}.json`);
            if (level) checkLevel(name, level);
        });
    }
}

// 2) Editores (solo si el archivo existe)
if (existsSync(join(DIR, "_editors.json"))) {
    const editors = readJSON("_editors.json");
    if (editors) {
        if (!Array.isArray(editors)) {
            err("data/_editors.json debe ser una lista [ ... ]");
        } else {
            editors.forEach((e, i) => {
                if (!isStr(e?.name)) err(`data/_editors.json editor #${i + 1}: falta "name"`);
                if (!ROLES.includes(e?.role)) err(`data/_editors.json editor #${i + 1}: "role" debe ser uno de ${ROLES.join(", ")}`);
            });
        }
    }
}

// 3) Archivos de niveles que no están en la lista (solo aviso)
if (existsSync(DIR)) {
    for (const f of readdirSync(DIR)) {
        if (f.endsWith(".json") && !f.startsWith("_") && !used.has(f.replace(/\.json$/, ""))) {
            console.log(`::warning::${DIR}/${f} no está en _list.json (no se mostrará en la página)`);
        }
    }
}

if (errors.length) {
    console.log(`\nSe encontraron ${errors.length} problema(s):\n`);
    for (const e of errors) console.log(`::error::${e}`);
    process.exit(1);
}
console.log("Todo en orden: los archivos de data/ son válidos.");
