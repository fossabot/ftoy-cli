<template>
    <div>
        <!-- 获取在 ./config.js 中定义的字段 [sample] 值 -->
        {{ attributes.sample.value }}
    </div>
</template>

<script>
import config from "./config";
export default config;
</script>

<style scoped lang="less">
@import "./main.less";
</style>