import React from "react";
import Skeleton from "react-loading-skeleton";

const ProfileSkeleton = () => {
  const profile = (
    <div className="profile" style={{ border: "1px solid #eee" }}>
      <div className="head text-center">
        <div className="d-flex justify-content-center align-items-center">
          <Skeleton circle={true} height={48} width={48} />
          <Skeleton circle={true} height={72} width={72} className="avatar" />
          <Skeleton circle={true} height={48} width={48} />
        </div>
        <Skeleton className="m-0 mt-2" height={20} width={150} /> <br />
        <Skeleton height={19} width={100} />
      </div>
      <div className="body">
        <Skeleton height={18} width={150} className="mb-3" />
        <div className="list">
          <div className="item">
            <Skeleton circle={true} height={23} width={23} className="mr-3" />
            <Skeleton height={19} width={200} />
          </div>
          <div className="item">
            <Skeleton circle={true} height={23} width={23} className="mr-3" />
            <Skeleton height={19} width={200} />
          </div>{" "}
          <div className="item">
            <Skeleton circle={true} height={23} width={23} className="mr-3" />
            <Skeleton height={19} width={200} />
          </div>{" "}
          <div className="item">
            <Skeleton circle={true} height={23} width={23} className="mr-3" />
            <Skeleton height={19} width={200} />
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="profiles">
      {profile}
      {profile}
      {profile}
    </div>
  );
};

export default ProfileSkeleton;
