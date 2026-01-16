'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/hooks/useProjectMutations';
import { toast } from 'sonner';

interface CreateProjectDialogProps {
  trigger?: React.ReactNode;
  children?: React.ReactNode;
  onProjectCreated?: (project: any) => void;
  onSuccess?: (project: any) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function CreateProjectDialog({
  trigger,
  children,
  onProjectCreated,
  onSuccess,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
}: CreateProjectDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  const { createProject, loading } = useCreateProject();

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? setControlledOpen : setInternalOpen;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const data = await createProject(name, description);

      toast.success('项目创建成功');
      setOpen?.(false);
      setName('');
      setDescription('');
      
      router.refresh(); // Refresh server components if any
      
      // Notify other components (like ProjectListView) to refresh
      window.dispatchEvent(new CustomEvent('project-created', { detail: data }));
      
      if (onProjectCreated) onProjectCreated(data);
      if (onSuccess) onSuccess(data);
      
      // Removed navigation to allow staying on the list
      // router.push(`/projects/${(data as any).id}`);
      
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('创建项目失败，请重试');
    }
  };

  const triggerNode = trigger ?? children;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerNode && <DialogTrigger asChild>{triggerNode}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>新建项目</DialogTitle>
            <DialogDescription>
              创建一个新的知识库项目，随后您可以上传文档并开始对话。
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">项目名称</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：2024 Q1 营销方案"
                disabled={loading}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">
                项目描述 <span className="text-slate-400">(可选)</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="简要描述项目的目标和内容"
                disabled={loading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen?.(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={!name.trim() || loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? '创建中...' : '确认创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
