import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'

import { Header } from './app/components'
import { PrivateRoute } from './routes/PrivateRoute'
import { routes } from './routes/routes'

const App = () => {
  return (
    <Routes>
      <Route 
        path="/" 
        element={<Header />}
      >
        {routes.map((route, i) => {
          if (route.permission) {
            return (
              <Route
                key={i}
                path={route.path}
                element={(
                  <Suspense fallback="Loading...">
                    <PrivateRoute
                      element={route.element}
                      permission={route.permission}
                    />
                  </Suspense>
                )}
              />
            )
          }
          return (
            <Route
              key={i}
              path={route.path}
              element={
                <Suspense fallback="Loading...">
                  {route.element}
                </Suspense>
              }
            />
          )
        })}
      </Route>
    </Routes>
  )
}

export default App
