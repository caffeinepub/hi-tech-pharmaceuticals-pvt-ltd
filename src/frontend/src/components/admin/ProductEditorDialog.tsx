import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useUpdateProduct, useGetAllCategories } from '../../hooks/useQueries';
import type { Product } from '../../backend';
import { ExternalBlob } from '../../backend';
import ProductPhotoUploader from './ProductPhotoUploader';

interface ProductEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export default function ProductEditorDialog({ open, onOpenChange, product }: ProductEditorDialogProps) {
  const [productId, setProductId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [bonusOffer, setBonusOffer] = useState('');
  const [photo, setPhoto] = useState<ExternalBlob | null>(null);

  const { data: categories = [] } = useGetAllCategories();
  const updateProduct = useUpdateProduct();

  useEffect(() => {
    if (product) {
      setProductId(product.id);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setCategoryId(product.category.id);
      setBonusOffer(product.bonusOffer || '');
      setPhoto(product.photo || null);
    } else {
      setProductId('');
      setName('');
      setDescription('');
      setPrice('');
      setCategoryId('');
      setBonusOffer('');
      setPhoto(null);
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productId.trim() || !name.trim() || !categoryId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await updateProduct.mutateAsync({
        productId: productId.trim(),
        name: name.trim(),
        description: description.trim(),
        price: BigInt(price || '0'),
        photo,
        categoryId,
        bonusOffer: bonusOffer.trim() || null,
      });
      toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save product');
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="productId">Product ID *</Label>
            <Input
              id="productId"
              placeholder="e.g., PROD001"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              disabled={!!product}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Dosage Form, Packing)</Label>
            <Textarea
              id="description"
              placeholder="e.g., Tablet, 10x10 Blister Pack"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Wholesale Price (NPR) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={categoryId} onValueChange={setCategoryId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bonusOffer">Bonus Offer</Label>
            <Input
              id="bonusOffer"
              placeholder="e.g., Buy 10 Get 1 Free"
              value={bonusOffer}
              onChange={(e) => setBonusOffer(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Product Photo</Label>
            <ProductPhotoUploader currentPhoto={photo} onPhotoChange={setPhoto} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProduct.isPending}>
              {updateProduct.isPending ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
