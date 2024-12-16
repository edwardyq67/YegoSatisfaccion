import React from 'react'
import "./spiner.css"
function Spiner() {
  return (
    <div className='overlay'>
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
</div>
  )
}

export default Spiner
