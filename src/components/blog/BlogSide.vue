<template>
    <div>
        <v-flex>
            <v-card height="200">
                First Card
            </v-card>
        </v-flex>
        <v-flex>
            <!-- <p class="subheading">{{ `${'Tags (' + tagsFreq.map(x => x.name).length + ')'}` }}</p> -->
            <highcharts class="chartContainer" :options="chartOptions" :updateArgs="updateArgs" :callback="initChart"></highcharts>
        </v-flex>
    </div>
</template>

<script>
// import Vue from 'vue';
// import store from '@/store/index'

// let vm = new Vue({
//     computed: {
//         points() {
//             return store.getters['dashboard/points']
//         },
//         cdf() {
//             return store.getters['dashboard/cdf']
//         }        
//     },
//     methods: {
//         add(e) {
//             if (e.series.name == 'Target' && !this.points.map(x => x['Quarter']).includes(e.category)) {
//                 //console.log(e.series.name + ' x: ' + e.x + ' y: ' + e.y)
//                 store.commit('dashboard/addPoints', this.cdf.filter(x => x['Quarter'] === e.category))
//             }
//         }
//     }
// })

export default {
    data () {
        return {
            updateArgs: [true, true, {duration: 1000}],
            scrollY: 0
        }
    },
    methods: {
        initChart (chart) {
            // console.log(chart)
            setTimeout(() => {
                chart.reflow()
            }, 300)
        },
        getScrollY() {
            this.scrollY = window.scrollY
            console.log(this.scrollY)
        }, 
    },
    computed: {
        tagsFreq () {
            return this.$store.getters['blog/tagsFreq']
        },
        chartOptions () {
            return {
                series: [{
                    type: 'wordcloud',
                    data: this.$store.getters['blog/tagsFreq'],
                    name: 'Articles',
                    margin: 0,
                    padding: 0,                
                }],
                minPadding: 0,
                maxPadding: 0,
                title: { text: null },
                exporting: { enabled: false },
                credits: { enabled: false },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events: {
                                //click: function () {
                                //    console.log(this.series.chart.reflow())
                                //}
                            }
                        }
                    }
                }
            }
        }
    },
    mounted() {
        this.$nextTick(function() {
            window.addEventListener('scroll', this.getScrollY)
            this.getScrollY()
        })
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.getScrollY)
    } 
}
</script>
