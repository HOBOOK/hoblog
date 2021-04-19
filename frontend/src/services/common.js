import router from "../routes/index.js"
import "../plugins/axios"

export default class Common {
    goRoute(route){
        if (router.app.$route.path !== route) {
            router.app.$router.push(route);
            window.scrollTo(0,0);
        }
    }
    goLeafRoute(author, title){
        let route = '/tree/@' + author + '/' + title
        if (router.app.$route.path !== route) {
            router.app.$router.push(route);
            window.scrollTo(0,0);
        }
    }
    getCurrentRoutePath() {
        return router.app.$router.currentRoute.path;
    }
    getCurrentRouteArticleInfo() {
        const root = router.app.$router.currentRoute.path;
        const query = {
            title: root.substring(root.lastIndexOf('/')+1),
            author: root.substring(root.indexOf('@')+1, root.lastIndexOf('/'))
        }
        return JSON.stringify(query)
    }
    findLeafInRoot (root, select) {
        for (let i = 0; i < root.length; i++) {
            if(root[i].name !== null && root[i].name === select)
                return root[i]
            else {
                let leaf = this.findLeafInRoot(root[i].children, select)
                if(typeof leaf === 'undefined') continue
                return leaf
            }
        }
    }
    deleteLeafInRoot (root, select) {
        for (let i = 0; i < root.length; i++) {
            if(root[i].name !== null && root[i].name === select){
                root.splice(i, 1)
                return true
            }
            else {
                let leaf = this.deleteLeafInRoot(root[i].children, select)
                if(!leaf) continue
            }
        }
        return false
    }
    //숫자단위포멧 변환 함수
    convertNumberUnit(number){
        let numStr = number.toString()
        if(numStr.length > 8) {
            return (number / 100000000).toFixed(1) + '억'
        } else if(numStr.length > 7) {
            return (number / 10000000).toFixed(1) + '천만'
        } else if(numStr.length > 4) {
            return (number / 10000).toFixed(1) + '만'
        } else if(numStr.length > 3) {
            return (number / 1000).toFixed(1) + '천'
        } else {
            return number
        }
    }
    //html 태그 제외한 텍스트 반환 함수
    replaceTag(html) {
        let regExp = /<\/?[^>]+>/gi;
        return html.replace(regExp,"");
    }
}