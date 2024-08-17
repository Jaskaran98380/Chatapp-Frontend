import { Avatar, Stack, Typography } from '@mui/material'
import React from 'react'
import moment from "moment"
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DescriptionIcon from '@mui/icons-material/Description';
import { transformImage } from '../../lib/features';

const Profile = ({user}) => {
  return (
    <Stack spacing={"1.5rem"} alignItems={"center"} >
        <Avatar
        // src={transformImage(user?.avatar?.url)}
        src={user?.avatar?.url}
        sx={{
            width:"10rem",
            height:"10rem",
            border:"5px solid white"
        }} />
        {/* <ProfileCard text={"Jaskaran Singh"} heading={"Web Developer"} Icon={<SentimentVerySatisfiedIcon />}/>
        <ProfileCard text={"jaskaranjas"} heading={"Username"} Icon={<AlternateEmailIcon />}/>
        <ProfileCard text={"sdhvbdh dfc dchc"} heading={"Bio"} Icon={<DescriptionIcon />}/>
        <ProfileCard text={moment('2024-01-23T00:00:00.000Z').fromNow()} heading={"Joined"} Icon={<CalendarMonthIcon />} /> */}
        <ProfileCard text={user?.name} heading={"Name"} Icon={<SentimentVerySatisfiedIcon />}/>
        <ProfileCard text={user?.username} heading={"Username"} Icon={<AlternateEmailIcon />}/>
        <ProfileCard text={user?.bio} heading={"Bio"} Icon={<DescriptionIcon />}/>
        <ProfileCard text={moment(user?.createdAt).fromNow()} heading={"Joined"} Icon={<CalendarMonthIcon />} />
    </Stack>
  )
}
const ProfileCard = ({text , heading , Icon})=>{
    return(
        <Stack direction={"column"} alignItems={"center"} textAlign={"center"}>
            {Icon && Icon}
    
                <Typography variant='body1' color={"white"}>{text}</Typography>
                <Typography variant='caption'>{heading}</Typography>
            
        </Stack>
       

    )

}

export default Profile