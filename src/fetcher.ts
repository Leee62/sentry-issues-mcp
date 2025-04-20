/** get sentry event by <ID> */
export async function fetchSentryEvent<T>(
  eventId: string,
  organization_id_or_slug: string,
  project_id_or_slug: string
): Promise<T | null> {
  try {
    const issueRes = await fetch(
      `https://${process.env.SENTRY_HOST}/api/0/projects/${organization_id_or_slug}/${project_id_or_slug}/events/${eventId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SENTRY_USER_TOKEN}`,
        },
      }
    );

    if (!issueRes.ok) {
      throw new Error(`HTTP error! status: ${issueRes.status}`);
    }
    return (await issueRes.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

/** get sentry events */
export async function fetchSentryEvents<T>(
  organization_id_or_slug: string,
  project_id_or_slug: string
): Promise<T | null> {
  try {
    const issueRes = await fetch(
      `https://${process.env.SENTRY_HOST}/api/0/projects/${organization_id_or_slug}/${project_id_or_slug}/events/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.SENTRY_USER_TOKEN}`,
        },
      }
    );

    if (!issueRes.ok) {
      throw new Error(`HTTP error! status: ${issueRes.status}`);
    }
    return (await issueRes.json()) as T;
  } catch (error) {
    console.error("Error making request:", error);
    return null;
  }
}

// /** get sentry issue by <ID> */
// export async function fetchSentryIssue<T>(
//   issueId: string,
//   organization_id_or_slug: string
// ): Promise<T | null> {
//   try {
//     const issueRes = await fetch(
//       `https://${process.env.SENTRY_HOST}/api/0/organizations/${organization_id_or_slug}/issues/${issueId}/`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.SENTRY_USER_TOKEN}`,
//         },
//       }
//     );

//     if (!issueRes.ok) {
//       throw new Error(`HTTP error! status: ${issueRes.status}`);
//     }
//     return (await issueRes.json()) as T;
//   } catch (error) {
//     console.error("Error making request:", error);
//     return null;
//   }
// }

// /** get sentry issue */
// export async function fetchSentryIssues<T>(
//   project_id_or_slug: string,
//   organization_id_or_slug: string
// ): Promise<T | null> {
//   const path = project_id_or_slug
//     ? `projects/${organization_id_or_slug}/${project_id_or_slug}/issues/`
//     : `organizations/${organization_id_or_slug}/issues/`;

//   try {
//     const issueRes = await fetch(
//       `https://${process.env.SENTRY_HOST}/api/0/${path}`,
//       {
//         method: "GET",
//         headers: {
//           Authorization: `Bearer ${process.env.SENTRY_USER_TOKEN}`,
//         },
//       }
//     );

//     if (!issueRes.ok) {
//       throw new Error(`HTTP error! status: ${issueRes.status}`);
//     }
//     return (await issueRes.json()) as T;
//   } catch (error) {
//     console.error("Error making request:", error);
//     return null;
//   }
// }
