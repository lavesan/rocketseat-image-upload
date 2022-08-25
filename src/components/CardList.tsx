import {
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Card } from './Card';
import { ModalViewImage } from './Modal/ViewImage';

export interface Card {
  title: string;
  description: string;
  url: string;
  ts: number;
  id: string;
}

interface CardsProps {
  cards: Card[];
}

export function CardList({ cards = [] }: CardsProps): JSX.Element {
  // TODO MODAL USEDISCLOSURE
  const { isOpen, onOpen, onClose } = useDisclosure();

  // TODO SELECTED IMAGE URL STATE
  const [selectedImg, setSelectedImg] = useState('');

  // TODO FUNCTION HANDLE VIEW IMAGE
  const selectImage = (card: Card) => {
    onOpen();
    setSelectedImg(card.url);
  };

  return (
    <>
      {/* TODO CARD GRID */}
      <SimpleGrid minChildWidth={290} spacing={4}>
        {cards.map(card => (
          <Flex
            key={card.id}
            as="button"
            flexDir="column"
            cursor="pointer"
            borderRadius={4}
            overflow="hidden"
            onClick={() => selectImage(card)}
          >
            <Image
              boxSize="80"
              objectFit="cover"
              src={card.url}
              alt={card.title}
            />
            <Flex
              w="100%"
              pt="5"
              px="6"
              pb="4"
              bg="pGray.800"
              flexDir="column"
              align="flex-start"
            >
              <Heading as="h3" mb="2" fontSize="lg">
                {card.title}
              </Heading>
              <Text fontSize="medium">{card.description}</Text>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>

      {/* TODO MODALVIEWIMAGE */}
      <ModalViewImage isOpen={isOpen} onClose={onClose} imgUrl={selectedImg} />
    </>
  );
}
