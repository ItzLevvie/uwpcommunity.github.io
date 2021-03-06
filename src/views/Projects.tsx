import * as React from "react";
import { Stack, Text, FontIcon } from "office-ui-fabric-react";
import { GetAllProjects, IProject } from "../common/services/projects";
import { ProjectCard } from "../components/ProjectCard";
import { PromiseVisualizer } from "../components/PromiseVisualizer";

export const Projects: React.StatelessComponent = () => {
  const [state, setState] = React.useState<IProject[]>();

  return (
    /* Todo: Add a header with brief explanation of the below */
    <Stack horizontalAlign="center" horizontal wrap tokens={{ childrenGap: 10 }}>
      <PromiseVisualizer promise={GetAllProjects()} onResolve={setState} loadingMessage='Loading Projects...' loadingStyle={{ padding: 25 }} errorStyle={{ padding: 25 }}>
        {state && (
          state.length > 0 ? state.sort((a, b) => a.appName.localeCompare(b.appName)).map((project, i) => (
            <ProjectCard key={i} onProjectRemove={project => setState(state.filter(p => p.appName !== project.appName))} project={project}></ProjectCard>
          )) : (
              <Stack horizontalAlign="center" >
                <FontIcon iconName="sad" style={{ fontSize: 55 }}></FontIcon>
                <Text variant="xLarge">No projects, yet</Text>
              </Stack>
            )
        )}
      </PromiseVisualizer>
    </Stack>
  );
};
