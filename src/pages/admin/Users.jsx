import React, { useEffect, useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import Table from '../../components/shared/Table'
import { dashboardData } from '../../constants/sampleData'
import { Avatar } from '@mui/material'
import AvatarCell from '../../components/specific/AvatarCell'
import { transformImage } from '../../lib/features'
import { useFetchData } from '6pp'
import { server } from '../../constants/config'
import { useErrors } from '../../hooks/hook'

const columns = [
  {
    field:"id",
    headerName:"Id",
    headerClassName:"table_column",
    width:250
  },
  {
    field:"name",
    headerName:"Name",
    headerClassName:"table_column",
    width:200
  },
  {
    field:"avatar",
    headerName:"Avatar",
    headerClassName:"table_column",
    width:200,
    renderCell : (params)=>(
      // <Avatar src={params.row.avatar} alt={params.row.name} />
      <AvatarCell value = {params.row.avatar} />
    )
  },
  {
    field:"username",
    headerName:"Username",
    headerClassName:"table_column",
    width:250
  },
  {
    field:"friends",
    headerName:"Friends",
    headerClassName:"table_column",
    width:113
  },
  {
    field:"groups",
    headerName:"Groups",
    headerClassName:"table_column",
    width:111
  },
]






const Users = () => {
  const [rows , setRows] = useState([]);

  const { loading, data, error } = useFetchData(
    `${server}/api/v1/admin/users`,
    "dashboard-users"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar:i.avatar
          // avatar: transformImage(i.avatar, 50),
        }))
      );
    }
  }, [data]);


  return (
    <AdminLayout>
      {loading ? <Skeleton /> : 
        <Table rows={rows} columns={columns} heading={"Users List"}/>
      }
    </AdminLayout>
  )
}

export default Users