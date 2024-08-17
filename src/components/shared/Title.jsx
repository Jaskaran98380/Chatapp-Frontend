import React from 'react'
import {Helmet} from "react-helmet-async"

const Title = ({title="Chat app" , description="This is the chat app"}) => {
  return (
    <Helmet title={title} />
  )
}

export default Title