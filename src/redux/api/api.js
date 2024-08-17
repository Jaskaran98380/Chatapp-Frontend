import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config.js";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat" , "User" , "Message"],

  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: "chat/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),
    searchUser: builder.query({
        query: (name) => ({
          url: `user/search?name=${name}`,
          credentials: "include",
        }),
        providesTags: ["User"],
      }),
    sendFriendRequest: builder.mutation({
        query: (data) => ({
          url: 'user/sendrequest',
          credentials: "include",
          method:"PUT",
          body:data
        }),
        providesTags: ["User"],
      }),
      getNotifications: builder.query({
        query: () => ({
          url: `user/getNotifications`,
          credentials: "include",
        }),
        keepUnusedDataFor: 0,
      }),
      acceptFriendRequest: builder.mutation({
        query: (data) => ({
          url: `user/acceptRequest`,
          credentials: "include",
          method:"PUT",
          body:data
        }),
        invalidatesTags:["Chat"]
      }),
      chatDetails: builder.query({
        query: ({chatId , populate=false}) => {

          let url =  `chat/${chatId}`;
          if(populate===true){
            url+='?populate=true'
          }
          return{
            url,
            credentials: "include",
          }
         
        }
        ,
        providesTags:["Chat"]
      }),
      getMessages: builder.query({
        query: ({chatId , page}) => ({
          url: `chat/message/${chatId}?page=${page}`,
          credentials: "include",
        }),
        keepUnusedDataFor:0
      }),
      sendAttachments: builder.mutation({
        query: (data) => ({
          url: "chat/sendAttachments",
          method: "POST",
          credentials: "include",
          body: data,
        }),
      }),
      myGroups: builder.query({
        query: () => ({
          url: "chat/myGroups",
          credentials: "include",
        }),
        providesTags: ["Chat"],
      }),

      availableFriends: builder.query({
        query: (chatId) => {
          let url = "user/getFriends";
          if(chatId) url +=`?chatId=${chatId}`;
          return{
            url,
            credentials: "include",
          } 
        },
        providesTags: ["Chat"],
      }),
      newGroup: builder.mutation({
        query: ({name , members}) => ({
          url: "chat/newGroup",
          method: "POST",
          credentials: "include",
          body: {name , members},
        }),
        invalidatesTags:["Chat"],
      }),
      renameGroupName: builder.mutation({
        query: ({chatId , name}) => ({
          url: `chat/${chatId}`,
          credentials: "include",
          method:"PUT",
          body:{name}
        }),
        invalidatesTags:["Chat"]
      }),
      removeGroupMember: builder.mutation({
        query: ({ chatId, userId }) => ({
          url: `chat/remove/member`,
          method: "PUT",
          credentials: "include",
          body: { chatId, userId },
        }),
        invalidatesTags: ["Chat"],
      }),
  
      addGroupMembers: builder.mutation({
        query: ({ members, chatId }) => ({
          url: `chat/add/members`,
          method: "PUT",
          credentials: "include",
          body: { members, chatId },
        }),
        invalidatesTags: ["Chat"],
      }),

    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    leaveGroup: builder.mutation({
      query: (chatId) => ({
        url: `chat/leave/${chatId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Chat"],
    }),
    makeAdmin: builder.mutation({
      query: ({chatId , userId}) => ({
        url: `chat/admin/make`,
        method: "PUT",
        credentials: "include",
        body:{chatId , userId}
      }),
      invalidatesTags: ["Chat"],
    }),
})
})


export default api;
export const {useMyChatsQuery , useLazySearchUserQuery, useSendFriendRequestMutation, useGetNotificationsQuery,useAcceptFriendRequestMutation , useChatDetailsQuery, useGetMessagesQuery, useSendAttachmentsMutation, useMyGroupsQuery, useAvailableFriendsQuery,useNewGroupMutation, useRenameGroupNameMutation, useRemoveGroupMemberMutation , useAddGroupMembersMutation, useDeleteChatMutation, useLeaveGroupMutation, useMakeAdminMutation} = api