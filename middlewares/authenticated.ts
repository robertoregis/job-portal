// middleware/authenticated.ts

export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useNuxtApp().$supabase

    // Pega a sessão atual
    const { data: { session } } = await supabase.auth.getSession()
    const isLoggedIn = !!session?.user

    const blockedRoutes = ['/entrar', '/cadastrar']
    console.log('oooo')
    if (isLoggedIn && blockedRoutes.some(route => to.path.startsWith(route))) {
        return navigateTo('/')
    }
})

