<template>
    <div class="presentation">
        <h1 :class="['ma-5', color+'--text']">Presentation</h1>
    </div>
</template>

<script>
export default {
    computed:{
        color(){return this.$store.getters.color},
    }
}
</script>