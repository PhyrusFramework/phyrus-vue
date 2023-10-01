const fs = require('fs');
const { dirname, resolve, basename } = require('path');

const ARGS = require('./get_command');

if (ARGS.commands.length < 1) {
    console.log("Page name not specified.");
    return;
}

let name = ARGS.commands[0];
let route = '';

const src = resolve(dirname('./') + '/src');
let folder = src + "/pages";

const parts = name.split('/');
for(const part of parts) {
    folder += '/' + part;
    route += '/' + part;

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true }, (err) => {});
    } else {
        continue;
    }
}

name = basename(folder);

if (fs.existsSync(folder + `/${name}.vue`)) {
    console.log("Page already exists.");
    return;
}

// Create vue file
fs.writeFileSync(folder + `/${name}.vue`, `<template>
    <app-page layout="default">
        <container id="${name}-page">

            <h1>${name}</h1>

        </container>
    </app-page>
</template>

<script lang="ts" src="./${name}.ts"></script>
<style lang="scss" src="./${name}.scss"></style>`);

// SCSS file
fs.writeFileSync(folder + `/${name}.scss`, `#${name}${(name.includes('-page') ? '' : '-page')} {

}`);

// TS file
let upperName = '';
let nextUpper = true;
for(let i = 0; i < name.length; ++i) {
    if (name[i] == '-') {
        nextUpper = true;
        continue;
    }

    if (nextUpper) {
        upperName += name[i].toUpperCase();
        nextUpper = false;
    } else {
        upperName += name[i];
    }
}

let format = ARGS.options.format;
if (!['class','composition','options']) {
    format = 'class';
}

if (format == 'options') {
    fs.writeFileSync(folder + `/${name}.ts`, `import { defineComponent } from "vue";

export defineComponent({

});`);
}

else if (format == 'composition') {
    fs.writeFileSync(folder + `/${name}.ts`, `import { defineComponent } from '@vue/composition-api'

export default defineComponent({
    setup() {
        return {
            
        }
    },
});`);
}

else {
    fs.writeFileSync(folder + `/${name}.ts`, `import { Component, Vue, toNative, Prop } from "vue-facing-decorator";

@Component({})
class ${upperName}Page extends Vue {


}
export default toNative(${upperName}Page);`);
}


// Add page route
let configFile = src + '/config/routes.ts';

function addRouteToFile (file) {

    let allContents = fs.readFileSync(file).toString();
    let str = '';

    // ADD IMPORT
    let index = allContents.lastIndexOf('IRoutes');

    let openIndex = index;
    while(openIndex > 1 && allContents[openIndex] != ";") {
        openIndex -= 1;
    }

    if (openIndex <= 1) return;
    openIndex += 1;

    str = allContents.substring(0, openIndex);
    str += "\n" + "import "+upperName+"Page from '../pages/"+name+"/"+name+".vue';";
    str += allContents.substring(openIndex);

    allContents = str;

    // ADD ROUTE

    index = allContents.lastIndexOf("[CLI]");
    if (index < 0) {
        return;
    }

    openIndex = index;
    while(openIndex > 1 && allContents[openIndex] != "\n") {
        openIndex -= 1;
    }

    if (openIndex <= 1) return;
    openIndex += 1;

    str = allContents.substring(0, openIndex);
    str += `        {
            path: '${route}',
            component: ${upperName}Page
        },\n`;
    str += allContents.substring(openIndex);
    
    fs.writeFileSync(file, str);
}

if (fs.existsSync(configFile)) {
    addRouteToFile(configFile);
}