import { ReactNode } from 'react'
import { Box, Container, Flex, Text, VStack } from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import BlankLayout from '@/components/layout/BlankLayout'

const Success = () => {
  return (
    <Flex height='100vh' alignItems='center'>
      <Container>
        <VStack>
          <Text fontSize='5xl' fontWeight={600}>THANK YOU</Text>
          <Box width='auto' padding={5} borderRadius='100%' bgColor='green.100'>
            <CheckIcon fontSize={50} color='green.600' />
          </Box>
          <Text fontSize='3xl'>Your form has been submitted</Text>
        </VStack>
      </Container>
    </Flex>
  )
}

Success.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

Success.guestGuard = true

export default Success
