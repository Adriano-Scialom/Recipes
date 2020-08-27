<template>
    <div>
        
    </div>
</template>

<script>
export default {
    methods:{
        toggle(){
            this.$store.commit('toggle_drawer')
        }
    },
    computed:{
        sortie(){return this.$store.state.drawer_sortie}
    }
}
</script>

<style scoped>

</style>