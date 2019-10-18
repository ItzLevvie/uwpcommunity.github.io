import * as React from "react";
import { IProject, GetAllProjects_Unfiltered } from "../common/services/projects";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { ProjectCard } from "./ProjectCard";
import { PromiseVisualizer } from "./PromiseVisualizer";

interface IProjectReviewPanelState {
    promise: Promise<IProject[]>;
    data?: IProject[];
    onPromiseFullfilled?: () => {}
}

interface IProjectReviewPanelProps {
    type: ReviewType;
}

export enum ReviewType {
    ManualReview, Launch
}

export const ProjectReviewPanel = (props: IProjectReviewPanelProps) => {
    const [state, setState] = React.useState<IProjectReviewPanelState>({ promise: GetAllProjects_Unfiltered() });

    function setProjectData(proj: IProject[]) {
        switch (props.type) {
            case ReviewType.ManualReview:
                proj = proj.filter(proj => proj.needsManualReview); break;
            case ReviewType.Launch:
                proj = proj.filter(proj => proj.awaitingLaunchApproval); break;
        }
        if (!state.data) setState({ ...state, data: proj });
    }

    return (
        <Stack horizontalAlign="center" tokens={{ childrenGap: 20 }}>
            <Text variant="xLarge">{(() => {
                switch (props.type) {
                    case ReviewType.ManualReview:
                        return "Pending review";
                    case ReviewType.Launch:
                        return "Launch submissions"
                    default: return "Error";
                }
            })()}</Text>
            <Stack wrap horizontal tokens={{ childrenGap: 10 }}>
                <PromiseVisualizer promise={state.promise} onResolve={setProjectData} loadingMessage='Loading Projects...' loadingStyle={{ marginTop: "25vh" }} errorStyle={{ marginTop: "25vh" }}>
                    {state && (state.data && state.data.length > 0 ? state.data.map((project, i) => (
                        <ProjectCard modOptions editable key={i} project={project}></ProjectCard>
                    )) : (
                            <Stack horizontalAlign="center" >
                                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                                <Text variant="xLarge">No projects, yet</Text>
                            </Stack>
                        )
                    )}
                </PromiseVisualizer>
            </Stack>
        </Stack>
    )
};