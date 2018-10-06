<template>
    <div>
        <v-flex>
            <v-card>
                <span class="subheading">{{ `${'Catagories (' + cats.map(x => x.name).length + ') '}` }}</span>
                <span v-if="selection.col === 'category'">
                    <a @click="reset" class="ml-2">
                        <v-icon size="16" color="info">cancel</v-icon>
                    </a>
                </span>
                <v-btn
                    v-for="cat in cats"
                    :key="cat.name"
                    block
                    small
                    @click="updateSelection(cat.name)"
                    class="mt-2 mb-2"
                >
                    {{ `${cat.name + ' (' + cat.weight + ')'}` }}
                </v-btn>
            </v-card>
        </v-flex>
        <v-flex>
            <span class="subheading">{{ `${'Tags (' + tags.map(x => x.name).length + ')'}` }}</span>
            <span v-if="selection.col === 'tags'">
                <a @click="reset" class="ml-2">
                    <v-icon size="16" color="info">cancel</v-icon>
                </a>
            </span>
            <highcharts class="chartContainer" :options="chartOptions" :updateArgs="updateArgs" :callback="initChart"></highcharts>
        </v-flex>
    </div>
</template>

<script>
import Vue from 'vue';
import store from '@/store/index'

let vm = new Vue({
    computed: {
        points() {
            return store.getters['dashboard/points']
        },
        cdf() {
            return store.getters['dashboard/cdf']
        }        
    },
    methods: {
        updateSelection (e) {
            store.commit('blog/updateSelection', {
                col: 'tags',
                val: e.name
            })
        }
    }
})

export default {
    data () {
        return {
            updateArgs: [true, true, {duration: 1000}],
            scrollY: 0
        }
    },
    methods: {
        initChart (chart) {
            setTimeout(() => {
                chart.reflow()
            }, 300)
        },
        updateSelection (name) {
            this.$store.commit('blog/updateSelection', {
                col: 'category',
                val: name
            })
        },
        reset () {
            this.$store.commit('blog/updateSelection', {
                col: null,
                val: null
            })            
        }
    },
    computed: {
        cats () {
            return this.$store.getters['blog/dist']('category').sort((a, b) => {
                if (a.weight > b.weight) return -1
                if (a.weight < b.weight) return 1
                return 0
            })
        },
        tags () {
            return this.$store.getters['blog/dist']('tags')
        },
        selection () {
            return this.$store.getters['blog/selection']
        },
        chartOptions () {
            return {
                series: [{
                    type: 'wordcloud',
                    data: this.tags,
                    name: 'Posts',
                    margin: 0,
                    padding: 0,                
                }],
                minPadding: 0,
                maxPadding: 0,
                title: { text: null },
                exporting: { enabled: false },
                credits: { enabled: true },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                click: function () {
                                   vm.updateSelection(this)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
</script>
