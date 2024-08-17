import React from 'react';
import { Avatar, Box } from '@mui/material';

const AvatarCell = ({ value }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      height="100%"
    >
      <Avatar src={value} />
    </Box>
  );
};

export default AvatarCell;