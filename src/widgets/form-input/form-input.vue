<template>
    <div class="form-input" :class="classnames()">

        <label v-if="label && !['media','image','video'].includes(type)" :for="inputName" v-html="label" />

        <InputText v-if="['text', 'email'].includes(type) && !mask && !suggestions" 
        :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()" 
        :disabled="isDisabled()"
        @keydown.enter="pressEnter()"
        :class="inputClassnames()"
        :type="type"
        ref="textInput"/>

        <!-- TEXT WITH SUGGESTIONS -->
        <AutoComplete v-if="type == 'text' && suggestions"
        :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()" 
        :disabled="isDisabled()" :class="inputClassnames()" :suggestions="suggestions"
        @item-select="suggestionSelected($event.value.value)"
        :optionLabel="suggestions && suggestions.length > 0 && suggestions[0].content ? 'content' : 'value'"
        :optionGroupLabel="suggestions && suggestions.length > 0 && suggestions[0].items ? 'value' : undefined" 
        optionGroupChildren="items">
            <template #optiongroup="slotProps">
                <div v-if="!slotProps.item.component" v-html="slotProps.item.content ? slotProps.item.content : slotProps.item.value"/>
                <component v-else :is="slotProps.item.component" v-bind="slotProps.item.props ? slotProps.item.props : {}"/>
            </template>
            <template #option="slotProps">
                <div v-if="!slotProps.option.component" v-html="slotProps.option.content ? slotProps.option.content : slotProps.option.value"/>
                <component v-else :is="slotProps.option.component" v-bind="slotProps.option.props ? slotProps.option.props : {}"/>
            </template>
        </AutoComplete>

        <!-- SEARCHBAR -->
        <div class="searchbar" v-if="type == 'search'">
            <AutoComplete
            ref="searchInput"
            :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()" 
            :disabled="isDisabled()" :class="inputClassnames()" :suggestions="suggestions"
            @item-select="suggestionSelected($event.value.value)"
            :optionLabel="suggestions && suggestions.length > 0 && suggestions[0].content ? 'content' : 'value'"
            :optionGroupLabel="suggestions && suggestions.length > 0 && suggestions[0].items ? 'value' : undefined" 
            optionGroupChildren="items">
                <template #optiongroup="slotProps">
                    <div v-if="!slotProps.item.component" v-html="slotProps.item.content ? slotProps.item.content : slotProps.item.value"/>
                    <component v-else :is="slotProps.item.component" v-bind="slotProps.item.props ? slotProps.item.props : {}"/>
                </template>
                <template #option="slotProps">
                    <div v-if="!slotProps.option.component" v-html="slotProps.option.content ? slotProps.option.content : slotProps.option.value"/>
                    <component v-else :is="slotProps.option.component" v-bind="slotProps.option.props ? slotProps.option.props : {}"/>
                </template>
            </AutoComplete>
            <svg-icon name="prime/search" class="search-icon"/>
        </div>

        <InputMask v-if="type == 'text' && mask" :modelValue="modelValue" @update:modelValue="updateValue($event)" 
        v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()"
        :mask="mask"
        @complete="passEmit('complete', modelValue)"/>

        <Textarea ref="textareaInput"
        v-if="type == 'textarea'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()" 
        :disabled="isDisabled()"
        :class="inputClassnames()"
        @keydown.enter="pressEnter()"/>

        <Password ref="passwordInput"
        @keydown.enter="pressEnter()"
        v-if="type == 'password'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()">
            <template #footer v-if="instructions">
                <br>
                <div v-html="instructions" />    
            </template>
        </Password>

        <InputNumber v-if="type == 'number'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()"
        :disabled="isDisabled()"
        ref="numberInput"
        :class="inputClassnames()"
        @keydown.enter="pressEnter"/>

        <Checkbox v-if="type == 'checkbox'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()" 
        :disabled="isDisabled()"
        :binary="true"
        :class="inputClassnames()"/>

        <InputSwitch v-if="type == 'toggle'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()"/>

        <ColorPicker v-if="type == 'color'" :modelValue="modelValue" @update:modelValue="updateValue($event)"
        v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()"/>

        <Dropdown v-if="type == 'select' && !suggestions && !multiple" :modelValue="selectOption" v-bind="bindProps()"
        :disabled="isDisabled()"
        :loading="isLoading()"
        :class="inputClassnames()" :options="getDropdownOptions()" panelClass="form-input-select"
        @show="passEmit('open', $event)" @hide="passEmit('close', $event)">
            <template #value="slotProps">
                <div v-if="slotProps.value && !slotProps.value.component" v-html="slotProps.value.content ? slotProps.value.content : slotProps.value.value"/>
                <component v-else-if="slotProps.value && slotProps.value.component" :is="slotProps.value.component" v-bind="slotProps.value.props ? slotProps.value.props : {}" />
                <div v-else v-html="placeholder" />
            </template>
            <template #option="slotProps">
                <div class="dropdown-option" @click="updateValue(slotProps.option)">
                <div v-if="!slotProps.option.component" v-html="slotProps.option.content ? slotProps.option.content : slotProps.option.value"/>
                <component v-else :is="slotProps.option.component" v-bind="slotProps.option.props ? slotProps.option.props : {}"/>
                </div>
            </template>
        </Dropdown>
        <!-- DROPDOWN WITH SUGGESTIONS -->
        <AutoComplete v-if="type == 'select' && suggestions && !multiple" :dropdown="true"
        :modelValue="selectOption" @input="updateValue($event)" v-bind="bindProps()" 
        :disabled="isDisabled()" :class="inputClassnames()" :suggestions="suggestions"
        @item-select="suggestionSelected($event.value.value)"
        :optionLabel="suggestions && suggestions.length > 0 && suggestions[0].content ? 'content' : 'value'"
        :optionGroupLabel="suggestions && suggestions.length > 0 && suggestions[0].items ? 'value' : undefined" 
        optionGroupChildren="items"
        @dropdown-click="passEmit('open', $event)" @hide="passEmit('close', $event)">
            <template #optiongroup="slotProps">
                <div v-if="!slotProps.item.component" v-html="slotProps.item.content ? slotProps.item.content : slotProps.item.value"/>
                <component v-else :is="slotProps.item.component" v-bind="slotProps.item.props ? slotProps.item.props : {}"/>
            </template>
            <template #option="slotProps">
                <div v-if="!slotProps.option.component" v-html="slotProps.option.content ? slotProps.option.content : slotProps.option.value"/>
                <component v-else :is="slotProps.option.component" v-bind="slotProps.option.props ? slotProps.option.props : {}"/>
            </template>
        </AutoComplete>
        <!-- MULTISELECT -->
        <MultiSelect v-if="type == 'select' && multiple" :modelValue="selectedOptions" v-bind="bindProps()"
        @update:modelValue="updateValue($event)"
        optionLabel="content"
        :disabled="isDisabled()"
        :loading="isLoading()"
        :class="inputClassnames()" :options="getDropdownOptions()" panelClass="form-input-select">
            <template #option="slotProps">
                <div class="dropdown-option">
                <div v-if="!slotProps.option.component" v-html="slotProps.option.content ? slotProps.option.content : slotProps.option.value"/>
                <component v-else :is="slotProps.option.component" v-bind="slotProps.option.props ? slotProps.option.props : {}"/>
                </div>
            </template>
        </MultiSelect>

        <Calendar v-if="type == 'date'" :modelValue="dateValue" @update:modelValue="updateValue($event)" v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()"
        panelClass="form-input-calendar"/>

        <FilePicker v-if="['media', 'image', 'video'].includes(type)" 
        :accept="mediaAccept()"
        :disabled="isDisabled()"
        v-bind="bindProps()" 
        @change="imagePicked">
            <div class="image-box-picker bgimage" :style="{
                'background-image': (mediaSrc && mediaType == 'image') ? 'url(' + mediaSrc + ')' : ''
            }" :class="{filled: mediaSrc}">

                <div v-if="!mediaSrc" class="image-box-picker-label">
                    <svg-icon name="prime/camera"/>
                    <div v-html="label ? label : mediaPickerLabel()"/>
                </div>

                <video-player v-if="mediaSrc && mediaType == 'video'" :src="mediaSrc"/>

                <div v-if="canDelete && mediaSrc" class="delete-btn" @click.stop="removeFile()">
                    <svg-icon name="prime/times" />
                </div>

            </div>
        </FilePicker>

        <Editor v-if="type == 'editor'" :modelValue="modelValue" @input="updateValue($event)" v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()">

            <template #toolbar v-if="toolbar">
                <span v-for="(row, index) in getToolbar()" :key="index" class="ql-formats">
                    <template v-for="(btn, i2) in row" :key="i2">
                        <button v-if="btn.type == 'btn'" :class="'ql-' + btn.class" :value="btn.value"/>
                        <select v-if="btn.type == 'select'" :class="'ql-' + btn.class">
                            <option v-if="btn.class == 'size'" selected></option>
                            <option v-for="(op, i3) in btn.options" :key="i3" :value="op"></option>
                        </select>
                    </template>
                </span>
            </template>

        </Editor>

        <Chips v-if="type == 'tags'" :modelValue="modelValue" @update:modelValue="updateValue($event)"
        v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()">
            <template #chip="slotProps">
                <slot name="content" v-if="$slots.content" :value="slotProps.value"/>
                <template v-else>{{ slotProps.value }}</template>
            </template>
        </Chips>

        <Slider v-if="type == 'slider'" :modelValue="modelValue" @update:modelValue="updateValue($event)"
        v-bind="bindProps()"
        :disabled="isDisabled()"
        :class="inputClassnames()"/>

        <label v-if="floatLabel" :for="inputName">{{floatLabel}}</label>

        <small class="form-input-help" :class="{floating: floatLabel}" v-if="help" v-html="help" />
        
    </div>
</template>

<script lang="ts" src="./form-input.ts"></script>
<style lang="scss" src="./form-input.scss"></style>