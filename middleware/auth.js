export default function ({ store, redirect, route }) {
  // If the user is not authenticated and trying to access a protected page
  if (!store.getters.isAuthenticated) {
    return redirect('/auth/login')
  }
}
