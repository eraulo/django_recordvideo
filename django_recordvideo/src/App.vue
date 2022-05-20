        <template>
            <div id="nav">
                <router-link class="btn btn-default" to="/">Home</router-link> |
                <router-link class="btn btn-default" to="/record">Record</router-link>
            </div>
            <router-view />
        </template>
        <style scoped>
            .router-link-active {
                color: red;
            }
        </style>
