import React from "react";
import Skeleton from "react-loading-skeleton";

const PostSkeleton = () => {
  return (
    <div className="listings-list">
      <div className="listings-content">
        <div className="listings-post" style={{ width: "100%" }}>
          <div className="post-header align-items-center">
            <div className="d-flex align-items-center">
              <Skeleton circle={true} height={28} width={28} />
              <span>
                <Skeleton height={20} width={150} />
              </span>
            </div>
            <div>
              <Skeleton height={20} width={70} />
            </div>
          </div>
          <div>
            <Skeleton height={256} width={350} />
          </div>
          <div className="listings-text">
            <div>
              <Skeleton height={20} width={320} />
            </div>
            <div>
              <Skeleton height={20} width={280} />
            </div>
            <div>
              <Skeleton height={20} width={250} />
            </div>
          </div>
          <div>
            <div className="listings-action d-flex align-items-center">
              <Skeleton circle={true} height={64} width={64} />
              <div style={{ margin: "0 25px" }}>
                <Skeleton circle={true} height={64} width={64} />
              </div>
              <Skeleton circle={true} height={64} width={64} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;
