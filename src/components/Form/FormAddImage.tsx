import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

type Form = {
  image: string;
  title: string;
  description: string;
};

type AddImageRequest = {
  url: string;
  title: string;
  description: string;
};

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: true,
      // pattern: /^.{,10000}$/,
      // TODO REQUIRED, LESS THAN 10 MB AND ACCEPTED FORMATS VALIDATIONS
    },
    title: {
      required: true,
      maxLength: 20,
      minLength: 5,
      // TODO REQUIRED, MIN AND MAX LENGTH VALIDATIONS
    },
    description: {
      required: true,
      maxLength: 50,
      // TODO REQUIRED, MAX LENGTH VALIDATIONS
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation(
    // TODO MUTATION API POST REQUEST,
    async (body: AddImageRequest) => {
      return api.post('/api/images', body);
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        // Reload files home
      },
    }
  );

  const { register, handleSubmit, reset, formState, setError, trigger } =
    useForm<Form>();
  const { errors } = formState;

  const onSubmit = async (data: Form): Promise<void> => {
    try {
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if (!data.image) {
        toast({
          status: 'error',
          title: 'Imagem inexistente',
          description: 'Esta imagem não existe.',
          duration: 2000,
          isClosable: true,
        });

        return;
      }
      // TODO EXECUTE ASYNC MUTATION
      await mutation.mutateAsync({
        url: imageUrl,
        title: data.title,
        description: data.description,
      });
      // TODO SHOW SUCCESS TOAST
      toast({
        status: 'success',
        title: 'Imagem salva',
        description: 'Imagem salva com sucesso!',
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        status: 'error',
        title: 'Erro',
        description: err.message || 'Erro inesperado',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      setImageUrl('');
      closeModal();
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          // TODO SEND IMAGE ERRORS
          error={errors.image}
          // TODO REGISTER IMAGE INPUT WITH VALIDATIONS
          {...register('image', formValidations.image)}
        />

        <TextInput
          placeholder="Título da imagem..."
          // TODO SEND TITLE ERRORS
          error={errors.title}
          // TODO REGISTER TITLE INPUT WITH VALIDATIONS
          {...register('title', formValidations.title)}
        />

        <TextInput
          placeholder="Descrição da imagem..."
          // TODO SEND DESCRIPTION ERRORS
          error={errors.description}
          // TODO REGISTER DESCRIPTION INPUT WITH VALIDATIONS
          {...register('description', formValidations.description)}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
