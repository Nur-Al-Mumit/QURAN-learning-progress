export const useNavigationLinks = () => {
  const Roles = {
    SUPER_ADMIN: 1,
    RECRUITER: 2,
    CANDIDATE: 3,
    BOTH: 4,
    RECRUITER_ADMIN2: 22,
    RECRUITER_TEACHING: 21,
  };

  const commonLinks = [
    {
      title: "Candidate Dashboard",
      icon: "Dashboard",
      link: "/dashboard",
    },
    {
      title: "Update Profile",
      icon: "UpdateProfile",
      link: "/profile",
    },
    {
      title: "View Profile",
      icon: "ViewProfile",
      link: "/profile-details",
    },
  ];

  const commonLinksLast = [
    {
      title: "Settings",
      icon: "Settings",
      link: "/settings",
    },
    {
      title: "Log Out",
      icon: "LogOut",
      link: "",
    },
  ];

  const candidateLinks = [
    {
      title: "Applied Jobs",
      icon: "AppliedJobs",
      link: "/applied-jobs",
    },
    // {
    //   title: "Job Alert",
    //   icon: "JobAlert",
    //   link: "../job-alert",
    // },
  ];

  const recruiterLinks = [
    {
      title: "Jobs",
      icon: "Jobs",
      link: "/recruiter/jobs",
    },
    {
      title: "Circular",
      icon: "Circular",
      link: "/recruiter/circulars",
    },
  ];

  const superadminLinks = [
    {
      title: "User Roles",
      icon: "UpdateProfile",
      link: "/recruiter/user-roles",
    },
  ];

  return {
    Roles,
    commonLinks,
    commonLinksLast,
    candidateLinks,
    recruiterLinks,
    superadminLinks
  };
}
