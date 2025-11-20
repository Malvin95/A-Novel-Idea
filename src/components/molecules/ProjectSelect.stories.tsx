import type { Meta, StoryObj } from '@storybook/react';
import ProjectSelect from './ProjectSelect';
import { useState } from 'react';

const meta = {
  title: 'Components/Molecules/ProjectSelect',
  component: ProjectSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component to manage state
function ProjectSelectWrapper({
  initialValue = '',
  ...props
}: Omit<React.ComponentProps<typeof ProjectSelect>, 'value' | 'onChange'> & {
  initialValue?: string;
}) {
  const [value, setValue] = useState(initialValue);
  
  return <ProjectSelect {...props} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: {} as never,
  render: () => <ProjectSelectWrapper />,
};

export const WithPreselectedValue: Story = {
  args: {} as never,
  render: () => <ProjectSelectWrapper initialValue="Project Alpha" />,
};

export const Disabled: Story = {
  args: {} as never,
  render: () => <ProjectSelectWrapper disabled={true} />,
};

export const NoLabel: Story = {
  args: {} as never,
  render: () => <ProjectSelectWrapper label="" />,
};

export const CustomPlaceholder: Story = {
  args: {} as never,
  render: () => <ProjectSelectWrapper label="Choose Project" placeholder="Pick one..." />,
};
