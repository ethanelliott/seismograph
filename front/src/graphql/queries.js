import gql from "graphql-tag";

export const APPLICATIONS = gql`
    query {
        applications {
            id
            url
            icon
            name
            recentResult {
                id
                status
                startedAt
                finishedAt
                responseTime
            }
            results {
                id
                status
                responseTime
            }
        }
    }
`;

export const APPLICATION = gql`
    query($id: String!) {
        application(id: $id) {
            id
            name
            icon
            url
            uptime {
                timestamp
                uptime
            }
            uptimeAllTime
            uptimeLast24Hours
            uptimeLast7Days
            recentResult {
                id
                status
                startedAt
                finishedAt
                httpStatus
                statusText
                timestamp
                responseTime
            }
            results {
                id
                status
                startedAt
                finishedAt
                httpStatus
                statusText
                timestamp
                responseTime
            }
            averageResponseTime
        }
    }
`;
