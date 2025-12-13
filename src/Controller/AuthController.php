<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\SecurityBundle\Security;

class AuthController extends AbstractController
{

    #[Route('/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(SessionInterface $session): JsonResponse
    {
        $session->invalidate();
        return new JsonResponse(['message' => 'Déconnexion réussie']);
    }

    #[Route('/api/me', name: 'me', methods: ['GET'])]
    public function me(Security $security): JsonResponse
    {
        $user = $security->getUser();
        return new JsonResponse([
            'isAdmin' => $user && in_array('ROLE_ADMIN', $user->getRoles()),
        ]);
    }
}
