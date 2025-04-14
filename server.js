import { app } from "../blogitbackedn/index.js"

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Server running on port 3000!')
})