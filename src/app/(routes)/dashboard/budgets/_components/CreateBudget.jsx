"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

  import EmojiPicker from 'emoji-picker-react'
  import { Anggaran } from 'utils/schema';
  import { db } from 'utils/dbConfig';
  import { toast } from 'sonner';

function CreateBudget() {

  const [emojiIcon,setEmojiIcon]=useState('😊');
  const [openEmojiPicker,setOpenEmojiPicker]=useState(false)

  const [name,setName]=useState();
  const [amount,setAmount]=useState();

  const {user}=useUser();
  const onCreateBudget = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) {
      toast.error('User belum login atau email belum tersedia.');
      return;
    }
  
    try {
      const result = await db.insert(Anggaran)
        .values({
          nama: name,
          jumlah: amount,
          icon: emojiIcon,
          createdBy: user.primaryEmailAddress.emailAddress
        })
        .returning({ insertId: Anggaran.id });
  
      if (result) {
        toast('Anggaran baru berhasil dibuat!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat anggaran.');
    }
  };
  

  return (
    <div>
      
      <Dialog>
          <DialogTrigger asChild>
            <div className='bg-slate-100 p-10 rounded-md
              items-center flex flex-col border-2 border-dashed
              cursor-pointer hover:shadow-md'>
              <h2 className='text-3xl'>+</h2>
              <h2>Buat Anggaran Baru</h2>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Anggaran Baru</DialogTitle>
              <DialogDescription>

              </DialogDescription>

                <div className='mt-5'>
                  <Button variant="outline"
                  className="text-lg"
                  onClick={()=>setOpenEmojiPicker(!openEmojiPicker)}
                  >{emojiIcon}</Button>
                  <div className='absolute'>
                    <EmojiPicker
                    open={openEmojiPicker}
                    onEmojiClick={(e)=>{
                      setEmojiIcon(e.emoji)
                      setOpenEmojiPicker(false)
                    }}
                    />
                  </div>
                  <div className='mt-2'>
                    <h2 className='text-black font-medium mt-1'>Nama Anggaran</h2>
                    <Input placeholder="contoh: Keperluan Rumah"
                    onChange={(e)=>setName(e.target.value)} />
                  </div>

                  <div className='mt-2'>
                    <h2 className='text-black font-medium my-1'>Jumlah Anggaran</h2>
                    <Input
                    type="number"
                    placeholder="contoh: 500000"
                    onChange={(e)=>setAmount(e.target.value)} />
                  </div>

                  <Button 
                    disabled={!(name&&amount)}
                    onClick={()=>onCreateBudget()}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white">Buat Anggaran</Button>
                </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
    </div>
  )
}

export default CreateBudget
