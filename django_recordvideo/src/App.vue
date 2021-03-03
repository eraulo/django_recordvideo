        <template>
            <div id="nav">
                <router-link to="/">Home</router-link> |
                <router-link to="/record">Record</router-link>
            </div>
            <router-view />
        </template>
        <style scoped>
            .router-link-active {
                color: red;
            }
        </style>
