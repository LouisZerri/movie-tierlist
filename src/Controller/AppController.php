<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class AppController extends AbstractController
{
    #[Route('/{reactRouting}', name: 'app', requirements: ['reactRouting' => '^(?!api|connexion|logout|me).*$'])]
    public function index(): Response
    {
        return $this->render('app/index.html.twig');
    }

}
