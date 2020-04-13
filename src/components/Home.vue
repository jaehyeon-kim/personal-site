<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xs10 sm8 md6 offset-xs1>
        <v-card>
          <v-img
            height=200
            src="/static/data-product.png"
            class="white--text"
          >
            <v-container>
              <v-layout column>
                <div style="height:150px">
                  <span class="headline">DATA PRODUCTS</span><br>
                  <span class="title">A product that facilitates an end goal through the use of data</span><br>
                  <span class="caption">
                    -- <a class="white--text" target="_blank" href="https://en.wikipedia.org/wiki/DJ_Patil">DJ Patil</a><v-icon dark size="10" class="mb-2">open_in_new</v-icon>,
                    Chief Data Scientist of <a class="white--text" target="_blank" href="https://www.whitehouse.gov/ostp/">OSTP</a><v-icon dark size="10" class="mb-2">open_in_new</v-icon>
                  </span>
                </div>
                <div>
                  <span class="caption">(Photo credit: nextmedia Pty Ltd.)</span>
                </div>
              </v-layout>
            </v-container>
          </v-img>
          <v-divider></v-divider>
          <v-card-text class="indigo darken-3 white--text">
              <p>
                <span class="subheading">Hi! My name is Jaehyeon Kim.</span>
              </p>    
              <p>
                <span>I have a mixed background. While I was majoring economics and actuarial studies, I focused on econometrics and applied statistics.</span>
                <span><a class="white--text" target="_blank" href="https://www.r-project.org/">R</a><v-icon dark size="10" class="mb-2">open_in_new</v-icon> was my preferred tool for quantitative analysis among others (SAS, EViews, Gauss and Matlab).</span>
                <span>After finishing my degrees, I began my career in building database and business applications using C#, MS SQL Server and SharePoint.</span>
                <span>While I was working as an analyst developer, I further taught myself R as a programming language and later extended my skillset to include <a class="white--text" target="_blank" href="https://www.python.org/">Python</a><v-icon dark size="10" class="mb-2">open_in_new</v-icon>.</span>
              </p>
              <p>Since then, I have been building my career in data product development and data engineering.</p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {

}
</script>
