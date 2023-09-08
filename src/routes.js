import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// Data
const Seat = React.lazy(() => import('./views/data/seat'))
const User = React.lazy(() => import('./views/data/user'))
const Menu = React.lazy(() => import('./views/data/menu'))
const User1 = React.lazy(() => import('./views/data/test_menu'))


//Transaksi
const TransaksiKasir = React.lazy(() => import('./views/transaction/transaksiKasir'))
const TransaksiManajer = React.lazy(() => import('./views/transaction/transaksiManajer'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/data/seat', name: 'Seat', element: Seat },
  { path: '/data/user', name: 'User', element: User },
  { path: '/data/menu', name: 'Menu', element: Menu },
  { path: '/data/test_menu', name: 'User', element: User1 },
  { path: '/transaksi/transaksiKasir', name: 'Transaksi Kasir', element: TransaksiKasir },
  { path: '/transaksi/transaksiManajer', name: 'Transaksi Manajer', element: TransaksiManajer },

]

export default routes
