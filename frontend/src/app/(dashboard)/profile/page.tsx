'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore } from '../../../lib/store';
import { api } from '../../../lib/axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { User as UserIcon, Loader2, Image as ImageIcon } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
  avatar: z.string().url('Please enter a valid image URL').or(z.literal('')).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, updateProfileState } = useAuthStore();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      avatar: user?.avatar || '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setSubmitting(true);
    try {
      await api.put('/users/profile', values);
      updateProfileState(values);
      toast.success('Profile updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-[#92400E]">Profile Details</h2>
        <p className="text-sm text-[#78716C]">Manage details regarding your identity card.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl">
        {/* Profile Card Preview */}
        <Card className="col-span-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-[#FEF3C7] border border-[#D97706]/20 flex items-center justify-center font-bold text-[#D97706] text-3xl overflow-hidden mb-4 shadow-warm-md">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name.charAt(0).toUpperCase()
            )}
          </div>
          <h3 className="font-extrabold text-lg text-[#92400E]">{user?.name}</h3>
          <p className="text-xs text-[#A8A29E] font-medium mt-1">{user?.email}</p>
          <span className="mt-4 px-3 py-1 bg-[#FEF3C7] border border-[#D97706]/15 rounded-full text-[10px] font-bold text-[#D97706] uppercase tracking-wider">
            {user?.role || 'Member'}
          </span>
        </Card>

        {/* Edit profile form */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-[#92400E]">
              <UserIcon className="w-5 h-5" />
              <CardTitle className="text-base font-bold">Edit Profile Details</CardTitle>
            </div>
            <CardDescription>Adjust name and profile identity cards.</CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-4">
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                error={errors.name?.message}
                {...register('name')}
              />

              <Input
                label="Profile Avatar URL"
                placeholder="https://images.unsplash.com/... or leave blank"
                error={errors.avatar?.message}
                {...register('avatar')}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-3 bg-[#FFFBF0]/60 p-4 border-t border-[#D97706]/10 rounded-b-xl">
              <Button type="submit" disabled={submitting} className="text-xs">
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Profile Details'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}

