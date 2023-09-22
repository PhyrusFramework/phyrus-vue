const fs = require('fs');
const { dirname, resolve, basename } = require('path');

const ARGS = require('./get_command');

if (ARGS.commands.length < 1) {
    console.log("Page name not specified.");
    return;
}

let name = ARGS.commands[0];
let route = '';

const src = resolve(dirname(require.main.filename) + '/../src');

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
    <app-page id="${name}-page">

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

    const allContents = fs.readFileSync(file).toString();

    let hadImport = true;
    let str = '';
    allContents.split(/\r?\n/).forEach((line) => {
        if (hadImport) {
    
            if (!line.includes('import ')) {
                hadImport = false;
                str += "import "+upperName+"Page from './pages/"+name+"/"+name+".vue';\n" + line + "\n";
            } else {
                str += line + "\n";
            }
        } else {
    
            if (!line.includes('//ADDROUTE')) {
                str += line + "\n";
            }
            else {
                str += `        {
            path: '${route}',
            component: ${upperName}Page
        },
        //ADDROUTE\n`;
            }
    
        }
    });
    
    fs.writeFileSync(file, str);

}

if (fs.existsSync(configFile)) {

    const content = fs.readFileSync(configFile);
    if (content.includes('//ADDROUTE')) {
        addRouteToFile(configFile);
    }

}