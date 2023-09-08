import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span className="ms-1">&copy; 2023 dhimazRamadhan.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1"># Cashier Application Concept</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
