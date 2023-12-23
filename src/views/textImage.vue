<template>
    <label>问题:</label>
    <input v-model="inputQuestion" />
    <br />
    <label>图片:</label>
    <input type="file" ref="inputImageRef" @change="fileChange" />
    <br />
    <div class="img-preview" v-for="(n, i) in inputImages" :style="`background-image: url(${ n.base64 })`"></div>
    <br />
    <button @click="send">发送</button>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';

const inputQuestion = ref('');
const inputImages = ref([]);
const inputImageRef = ref();

const genAI = new GoogleGenerativeAI('AIzaSyCgnSPxRXO0oSpu-9fJjtJefZBF4BOJzuQ');
const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

const fileChange = event => {
    const file = inputImageRef.value.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => inputImages.value.push({ file, base64: reader.result });
};

const send = async () => {
    const imagePromises = inputImages.value.map(async item => {
        const reader = new FileReader();
        reader.readAsDataURL(item.file);
        await new Promise(resolve => (reader.onloadend = resolve));
        return {
            inlineData: {
                data: reader.result.split(',')[1],
                mimeType: item.file.type
            }
        };
    });
    const imageParts = await Promise.all(imagePromises);
    const result = await model.generateContent([inputQuestion.value, ...imageParts]);
    const response = await result.response;
    const text = response.text();
};
</script>
<style lang="scss" scoped>
.img-preview {
    width: 100px;
    height: 100px;
    background-size: cover;
    background-position: 50% 50%;
    display: inline-block;
    margin: 10px;
}
</style>