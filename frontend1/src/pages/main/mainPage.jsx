import {  useEffect, useMemo, useState } from "react";
import { PostCard, Pagination, Search } from "./components";
import { PAGINATION_LIMIT } from "../../../constants";
import {  debounce, request } from "./utils";
import styled from "styled-components"

const MainPageContainer = ({className}) => {

  const [page,setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [posts,setPosts] = useState([])
  const [searchPhrase, setSearchPhrase] = useState('')
  const [shouldSearch, setShouldSearch] = useState(false)

  useEffect (()=>{
      request(`/posts?search=${searchPhrase}&page=${page}&limit=${PAGINATION_LIMIT}`)
        .then(( {data:{posts,lastPage} })=> {
          setPosts(posts)
          setLastPage(lastPage)
          
        })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ page,shouldSearch])

  const startDelayedSearch = useMemo(()=> debounce(setShouldSearch,2000),[])

  const onSearch = ({target}) => {
    setSearchPhrase(target.value)
    startDelayedSearch(!shouldSearch)
  }

  return(
    <>
    <div className={className}>
      <div className="search-bar">
        <Search searchPhrase={searchPhrase} onChange={onSearch} />
      </div>

      { posts.length ?
      <div className="post-list">
        {posts.map(({id, title, publishedAt, imageUrl, comments}) => 
          <PostCard key={id} id={id} title={title} publishedAt={publishedAt} commentsCount={comments.length} imageUrl={imageUrl} />)}
      </div>
      : <div className="posts-error">No posts found</div> }

      <div className="pagination">
        {lastPage > 1 && (
          <Pagination lastPage={lastPage} setPage={setPage} page={page}  /> )}
      </div>
      
    </div>
    </>
  )
}

export const MainPage = styled(MainPageContainer)`
  & .post-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 20px 20px 80px;
  }
  & .posts-error{
    font-size: 20px;
    margin-top: 40px;
    text-align: center;
  }
`;